"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  AdBudgetSlider,
  ClaimsEditor,
  GoalsPicker,
  IcpCardEditor,
  ModelFollowUpsForm,
  VoiceEditor,
} from "@/components/app/brain-editors";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MODEL_LABELS } from "@/lib/labels";
import { icpTemplates, MODEL_OPTIONS, suggestModel } from "@/lib/model-config";
import { useWorkspace } from "@/lib/store";
import type { BusinessModel, Claim, IcpCard, ModelFollowUps } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "scan", label: "Website scan", title: "Paste your product URL." },
  { id: "model", label: "Business model", title: "How do you make money?" },
  { id: "goals", label: "Goals", title: "What should the next 3 weeks produce?" },
  { id: "voice", label: "Voice", title: "Show us how you write." },
  { id: "claims", label: "Claims", title: "Mark anything we must never say." },
  { id: "icp", label: "ICP", title: "Who are we going after first?" },
  { id: "review", label: "Review", title: "Your Business Brain." },
] as const;

const SCAN_CHECKS = [
  "Fetching homepage and pricing",
  "Reading product and about pages",
  "Pulling claims and proof",
  "Sampling tone from public posts",
  "Finding where your buyers show up",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { state, completeOnboarding } = useWorkspace();
  const brain = state.brain;

  const [step, setStep] = useState(0);
  const [url, setUrl] = useState(state.tenant.productUrl);
  const [scanProgress, setScanProgress] = useState(-1);
  const [offer, setOffer] = useState(brain.offer.value);
  const [audience, setAudience] = useState(brain.icp.value);

  const [model, setModel] = useState<BusinessModel | null>(null);
  const [notSure, setNotSure] = useState(false);
  const [followUps, setFollowUps] = useState<ModelFollowUps>({});

  const [goals, setGoals] = useState<string[]>([]);
  const [adBudget, setAdBudget] = useState(0);

  const [voiceSamples, setVoiceSamples] = useState<string[]>(brain.voiceSamples);
  const [soundsLike, setSoundsLike] = useState(brain.soundsLike);

  const [claims, setClaims] = useState<Claim[]>(brain.claims);
  const [prohibited, setProhibited] = useState<Claim[]>(brain.prohibited);

  const [icps, setIcps] = useState<IcpCard[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const scanned = scanProgress >= SCAN_CHECKS.length;
  const scanning = scanProgress >= 0 && !scanned;

  useEffect(() => {
    if (!scanning) return;
    const timer = window.setTimeout(() => setScanProgress((value) => value + 1), 450);
    return () => window.clearTimeout(timer);
  }, [scanning, scanProgress]);

  const suggestion = useMemo(
    () => suggestModel(`${offer} ${audience} ${url}`, state.tenant.businessModel),
    [offer, audience, url, state.tenant.businessModel]
  );

  function pickModel(next: BusinessModel) {
    if (next !== model) {
      setFollowUps(next === brain.businessModel ? { ...brain.modelFollowUps } : {});
      setIcps(next === brain.businessModel ? brain.icps.map((c) => ({ ...c })) : icpTemplates(next));
      setSelected([]);
    }
    setModel(next);
  }

  const canNext = (() => {
    switch (STEPS[step].id) {
      case "scan":
        return scanned && offer.trim().length > 0;
      case "model":
        return model !== null;
      case "goals":
        return goals.length > 0;
      case "icp":
        return selected.length >= 1 && selected.length <= 2;
      default:
        return true;
    }
  })();

  const finish = useCallback(() => {
    if (!model) return;
    completeOnboarding(
      {
        offer: { ...brain.offer, value: offer },
        icp: { ...brain.icp, value: audience },
        modelFollowUps: followUps,
        goals,
        monthlyAdBudget: adBudget > 0 ? adBudget : undefined,
        voiceSamples: voiceSamples.filter((s) => s.trim()),
        soundsLike,
        claims,
        prohibited,
        icps,
        selectedIcpIds: selected,
      },
      model
    );
    router.push("/app/brain");
  }, [
    adBudget, audience, brain.icp, brain.offer, claims, completeOnboarding, followUps,
    goals, icps, model, offer, prohibited, router, selected, soundsLike, voiceSamples,
  ]);

  const next = useCallback(() => {
    if (!canNext) return;
    if (step === STEPS.length - 1) finish();
    else setStep((value) => value + 1);
  }, [canNext, finish, step]);
  const back = useCallback(() => setStep((value) => Math.max(0, value - 1)), []);

  const nextRef = useRef(next);
  const backRef = useRef(back);
  useEffect(() => {
    nextRef.current = next;
    backRef.current = back;
  }, [next, back]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const el = event.target as HTMLElement | null;
      const tag = el?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        nextRef.current();
        return;
      }
      if (event.key === "Enter" && tag === "INPUT" && (el as HTMLInputElement).type !== "range") {
        event.preventDefault();
        nextRef.current();
        return;
      }
      if (typing || tag === "BUTTON") return;
      if (event.key === "ArrowRight" || event.key === "Enter") nextRef.current();
      if (event.key === "ArrowLeft") backRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = STEPS[step];
  const selectedIcps = icps.filter((icp) => selected.includes(icp.id));

  return (
    <div className="grid min-h-dvh bg-background text-foreground lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden border-r border-border lg:flex lg:flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 10%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, color-mix(in oklab, var(--brand) 10%, transparent), transparent 50%), var(--muted)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col gap-8 p-6">
          <Logo />
          <ol className="space-y-1">
            {STEPS.map((item, index) => {
              const done = index < step;
              const active = index === step;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={index > step}
                    onClick={() => setStep(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[8px] px-2 py-2 text-left text-14 transition-colors duration-150 ease-out",
                      active ? "bg-card text-foreground ring-1 ring-border" : "text-muted-foreground",
                      index <= step && !active && "hover:bg-card/70"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border text-12 tabular-nums",
                        done && "border-foreground bg-foreground text-background",
                        active && "border-foreground",
                        !done && !active && "border-border"
                      )}
                    >
                      {done ? <Check className="size-3" /> : index + 1}
                    </span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-auto font-mono text-12 text-muted-foreground">
            Enter next · ← back
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 lg:hidden">
          <Logo />
          <p className="font-mono text-12 text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </p>
        </header>
        <div className="h-0.5 bg-border lg:hidden">
          <div
            className="h-full bg-foreground transition-[width] duration-200 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-8 lg:py-16">
          <p className="font-mono text-12 uppercase tracking-wide text-muted-foreground">
            {current.label}
          </p>
          <h1 className="heading-1 mt-2">{current.title}</h1>

          <div className="mt-8 flex-1 space-y-6">
            {current.id === "scan" ? (
              <>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    aria-label="Product URL"
                    className="h-10"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://yourproduct.com"
                  />
                  <Button
                    size="lg"
                    disabled={scanning || !url.trim()}
                    onClick={() => {
                      setScanProgress(0);
                    }}
                  >
                    {scanning ? "Reading…" : scanned ? "Scan again" : "Scan site"}
                  </Button>
                </div>
                {scanProgress >= 0 ? (
                  <ul className="surface divide-y divide-border">
                    {SCAN_CHECKS.map((label, index) => {
                      const ok = index < scanProgress;
                      const running = index === scanProgress && !scanned;
                      return (
                        <li key={label} className="flex items-center gap-3 px-4 py-2.5 text-14">
                          <span
                            className={cn(
                              "flex size-4 items-center justify-center rounded-full border",
                              ok ? "border-foreground bg-foreground text-background" : "border-border"
                            )}
                          >
                            {ok ? <Check className="size-3" /> : null}
                          </span>
                          <span className={ok || running ? "" : "text-muted-foreground"}>{label}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <button
                    type="button"
                    className="text-13 text-muted-foreground underline-offset-4 hover:underline"
                    onClick={() => {
                      setScanProgress(SCAN_CHECKS.length);
                    }}
                  >
                    Skip the scan and use what we have
                  </button>
                )}
                {scanned ? (
                  <div className="surface space-y-4 p-4">
                    <p className="text-12 text-muted-foreground">
                      What we understood. Edit anything that is off.
                    </p>
                    <div className="space-y-1.5">
                      <Label htmlFor="scan-offer">Offer</Label>
                      <Textarea
                        id="scan-offer"
                        rows={3}
                        className="rounded-[8px]"
                        value={offer}
                        onChange={(event) => setOffer(event.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="scan-audience">Audience</Label>
                      <Textarea
                        id="scan-audience"
                        rows={3}
                        className="rounded-[8px]"
                        value={audience}
                        onChange={(event) => setAudience(event.target.value)}
                      />
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}

            {current.id === "model" ? (
              <>
                <p className="max-w-xl text-14 text-muted-foreground">
                  This is required. It decides your ICP shape, channel ranks, outreach style, and
                  who your ads target.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {MODEL_OPTIONS.map((option) => {
                    const active = model === option.id && !notSure;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setNotSure(false);
                          pickModel(option.id);
                        }}
                        className={cn(
                          "surface p-4 text-left transition-colors duration-150 ease-out hover:bg-muted",
                          active && "border-foreground ring-1 ring-foreground"
                        )}
                      >
                        <p className="text-16 font-semibold">{option.label}</p>
                        <p className="mt-1 text-13 text-muted-foreground">{option.blurb}</p>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-pressed={notSure}
                    onClick={() => {
                      setNotSure(true);
                      pickModel(suggestion.model);
                    }}
                    className={cn(
                      "surface-muted border-dashed p-4 text-left transition-colors duration-150 ease-out hover:bg-muted",
                      notSure && "border-foreground ring-1 ring-foreground"
                    )}
                  >
                    <p className="text-16 font-semibold">Not sure, suggest one</p>
                    <p className="mt-1 text-13 text-muted-foreground">
                      We read your site and pick the closest fit.
                    </p>
                  </button>
                </div>
                {notSure ? (
                  <div className="surface space-y-1 p-4">
                    <p className="text-14 font-medium">
                      We suggest {MODEL_LABELS[suggestion.model]}.
                    </p>
                    <p className="text-13 text-muted-foreground">{suggestion.reason}</p>
                    <p className="text-12 text-muted-foreground">Pick a card above to override.</p>
                  </div>
                ) : null}
                {model ? (
                  <div className="space-y-3">
                    <h2 className="text-16 font-semibold">
                      A few questions for {MODEL_LABELS[model]}
                    </h2>
                    <ModelFollowUpsForm model={model} value={followUps} onChange={setFollowUps} />
                  </div>
                ) : null}
              </>
            ) : null}

            {current.id === "goals" ? (
              <>
                <GoalsPicker value={goals} onChange={setGoals} />
                <div className="surface p-4">
                  <AdBudgetSlider value={adBudget} onChange={setAdBudget} />
                </div>
              </>
            ) : null}

            {current.id === "voice" ? (
              <VoiceEditor
                samples={voiceSamples}
                soundsLike={soundsLike}
                onSamples={setVoiceSamples}
                onSoundsLike={setSoundsLike}
              />
            ) : null}

            {current.id === "claims" ? (
              <ClaimsEditor
                claims={claims}
                prohibited={prohibited}
                onChange={(value) => {
                  setClaims(value.claims);
                  setProhibited(value.prohibited);
                }}
              />
            ) : null}

            {current.id === "icp" ? (
              <>
                <p className="text-13 text-muted-foreground">
                  Pick one or two. Edit a card if it is close but not right.
                  {model ? ` Shaped for ${MODEL_LABELS[model]}.` : ""}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {icps.map((icp) => (
                    <IcpCardEditor
                      key={icp.id}
                      icp={icp}
                      selected={selected.includes(icp.id)}
                      disabled={selected.length >= 2}
                      onToggle={() =>
                        setSelected((ids) =>
                          ids.includes(icp.id) ? ids.filter((id) => id !== icp.id) : [...ids, icp.id]
                        )
                      }
                      onEdit={(patch) =>
                        setIcps((list) => list.map((c) => (c.id === icp.id ? { ...c, ...patch } : c)))
                      }
                    />
                  ))}
                </div>
              </>
            ) : null}

            {current.id === "review" ? (
              <div className="space-y-3">
                <ReviewRow label="Business model" value={model ? MODEL_LABELS[model] : "-"} />
                <ReviewRow label="Offer" value={offer} />
                <ReviewRow
                  label="Goals"
                  value={`${goals.join(", ") || "-"}${adBudget ? ` · $${adBudget.toLocaleString()}/mo ads` : ""}`}
                />
                <ReviewRow
                  label="Voice"
                  value={`${voiceSamples.filter((s) => s.trim()).length} samples · sounds like ${soundsLike || "-"}`}
                />
                <ReviewRow
                  label="Claims"
                  value={`${claims.length} allowed · ${prohibited.length} banned`}
                />
                <ReviewRow label="ICP" value={selectedIcps.map((i) => i.name).join(", ")} />
                <p className="text-13 text-muted-foreground">
                  Everything stays editable in the Business Brain. Approvals are required until you
                  trust autopilot.
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-4">
            <Button variant="ghost" onClick={back} disabled={step === 0}>
              Back
            </Button>
            <div className="flex items-center gap-2">
              {(current.id === "voice" || current.id === "claims") && step < STEPS.length - 1 ? (
                <Button variant="ghost" onClick={() => setStep((v) => v + 1)}>
                  Skip
                </Button>
              ) : null}
              <Button size="lg" disabled={!canNext} onClick={next}>
                {step === STEPS.length - 1 ? "Open Business Brain" : "Continue"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface grid gap-1 p-4 sm:grid-cols-[140px_1fr]">
      <p className="text-12 text-muted-foreground">{label}</p>
      <p className="text-14">{value}</p>
    </div>
  );
}
