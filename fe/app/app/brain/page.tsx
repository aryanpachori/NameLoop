"use client";

import { useState } from "react";
import {
  AdBudgetSlider,
  ClaimsEditor,
  GoalsPicker,
  IcpCardEditor,
  ModelFollowUpsForm,
  VoiceEditor,
} from "@/components/app/brain-editors";
import { PageHeader } from "@/components/page-header";
import { SourceChip } from "@/components/source-chip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDue, MODEL_LABELS } from "@/lib/labels";
import { icpTemplates, MODEL_OPTIONS } from "@/lib/model-config";
import { useWorkspace } from "@/lib/store";
import type { BusinessBrain, BusinessModel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface space-y-4 p-4 sm:p-5">
      <div>
        <h2 className="text-16 font-semibold">{title}</h2>
        {hint ? <p className="mt-0.5 text-13 text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function BrainPage() {
  const { state, activeTenantId } = useWorkspace();
  // Remount the editor when the tenant or saved version changes so drafts reset.
  return (
    <BrainEditor key={`${activeTenantId}-${state.brain.version}`} brain={state.brain} />
  );
}

function BrainEditor({ brain }: { brain: BusinessBrain }) {
  const { updateBrain, setBusinessModel } = useWorkspace();

  const [model, setModel] = useState<BusinessModel>(brain.businessModel);
  const [followUps, setFollowUps] = useState(brain.modelFollowUps);
  const [goals, setGoals] = useState(brain.goals);
  const [adBudget, setAdBudget] = useState(brain.monthlyAdBudget ?? 0);
  const [offer, setOffer] = useState(brain.offer.value);
  const [voice, setVoice] = useState(brain.voice.value);
  const [samples, setSamples] = useState(brain.voiceSamples);
  const [soundsLike, setSoundsLike] = useState(brain.soundsLike);
  const [claims, setClaims] = useState(brain.claims);
  const [prohibited, setProhibited] = useState(brain.prohibited);
  const [icps, setIcps] = useState(brain.icps);
  const [selected, setSelected] = useState(brain.selectedIcpIds);

  const dirty =
    JSON.stringify([model, followUps, goals, adBudget, offer, voice, samples, soundsLike, claims, prohibited, icps, selected]) !==
    JSON.stringify([
      brain.businessModel,
      brain.modelFollowUps,
      brain.goals,
      brain.monthlyAdBudget ?? 0,
      brain.offer.value,
      brain.voice.value,
      brain.voiceSamples,
      brain.soundsLike,
      brain.claims,
      brain.prohibited,
      brain.icps,
      brain.selectedIcpIds,
    ]);

  function changeModel(next: BusinessModel) {
    if (next === model) return;
    setModel(next);
    setFollowUps({});
    // ICP cards are model-shaped. Offer fresh ones for the new model.
    setIcps(icpTemplates(next));
    setSelected([]);
    toast.message(`ICP cards regenerated for ${MODEL_LABELS[next]}. Pick one before saving.`);
  }

  function save() {
    if (selected.length < 1) {
      toast.error("Pick at least one ICP.");
      return;
    }
    if (model !== brain.businessModel) setBusinessModel(model);
    updateBrain({
      businessModel: model,
      modelFollowUps: followUps,
      goals,
      monthlyAdBudget: adBudget > 0 ? adBudget : undefined,
      offer: { ...brain.offer, value: offer },
      voice: { ...brain.voice, value: voice },
      voiceSamples: samples.filter((s) => s.trim()),
      soundsLike,
      claims,
      prohibited,
      icps,
      selectedIcpIds: selected,
    });
    toast.success("Business Brain saved as a new version");
  }

  function reset() {
    setModel(brain.businessModel);
    setFollowUps(brain.modelFollowUps);
    setGoals(brain.goals);
    setAdBudget(brain.monthlyAdBudget ?? 0);
    setOffer(brain.offer.value);
    setVoice(brain.voice.value);
    setSamples(brain.voiceSamples);
    setSoundsLike(brain.soundsLike);
    setClaims(brain.claims);
    setProhibited(brain.prohibited);
    setIcps(brain.icps);
    setSelected(brain.selectedIcpIds);
  }

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        eyebrow={`Business Brain · v${brain.version}`}
        title="What NameLoop knows about your business"
        description="Every draft, channel rank, and ad audience is built from this. Edit it and save a new version."
      />

      <Section
        title="Business model"
        hint="Changing this regenerates ICP cards and re-ranks channels."
      >
        <div className="flex flex-wrap gap-2">
          {MODEL_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={model === option.id}
              onClick={() => changeModel(option.id)}
              className={cn(
                "h-8 rounded-[8px] border px-3 text-13 font-medium transition-colors duration-150 ease-out",
                model === option.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <ModelFollowUpsForm model={model} value={followUps} onChange={setFollowUps} />
      </Section>

      <Section title="Goals and budget">
        <GoalsPicker value={goals} onChange={setGoals} />
        <AdBudgetSlider value={adBudget} onChange={setAdBudget} />
      </Section>

      <Section title="Offer and voice">
        <div className="space-y-1.5">
          <Label htmlFor="brain-offer">Offer</Label>
          <Textarea
            id="brain-offer"
            rows={3}
            className="rounded-[8px]"
            value={offer}
            onChange={(event) => setOffer(event.target.value)}
          />
          <SourceChip source={brain.offer.source} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="brain-voice">Voice rules</Label>
          <Textarea
            id="brain-voice"
            rows={3}
            className="rounded-[8px]"
            value={voice}
            onChange={(event) => setVoice(event.target.value)}
          />
        </div>
        <VoiceEditor
          samples={samples}
          soundsLike={soundsLike}
          onSamples={setSamples}
          onSoundsLike={setSoundsLike}
        />
      </Section>

      <Section title="Claims" hint="Drafts that use a banned claim are blocked before they reach Approvals.">
        <ClaimsEditor
          claims={claims}
          prohibited={prohibited}
          onChange={(value) => {
            setClaims(value.claims);
            setProhibited(value.prohibited);
          }}
        />
      </Section>

      <Section
        title="Ideal customers"
        hint={`Pick one or two. Selected: ${selected.length}/2.`}
      >
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
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Proof">
          <ul className="space-y-3">
            {brain.proof.map((item) => (
              <li key={item.value} className="space-y-1.5">
                <p className="text-14">{item.value}</p>
                <SourceChip source={item.source} />
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Lasting preferences and competitors">
          <ul className="space-y-1 text-14">
            {brain.lastingPreferences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-1.5">
            {brain.competitors.map((name) => (
              <span key={name} className="rounded-[8px] border border-border px-2 py-0.5 text-12">
                {name}
              </span>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Version history">
        <ol className="divide-y divide-border">
          <li className="flex items-center justify-between gap-3 py-2 text-14">
            <span>
              <span className="font-[family-name:var(--font-geist-mono)] text-13">v{brain.version}</span>{" "}
              Current
            </span>
            <span className="text-12 text-muted-foreground">{formatDue(brain.updatedAt)}</span>
          </li>
          {brain.history.map((entry, index) => (
            <li
              key={`${entry.version}-${index}`}
              className="flex items-center justify-between gap-3 py-2 text-14"
            >
              <span>
                <span className="font-[family-name:var(--font-geist-mono)] text-13">v{entry.version}</span>{" "}
                {entry.note}
              </span>
              <span className="text-12 text-muted-foreground">{formatDue(entry.at)}</span>
            </li>
          ))}
        </ol>
      </Section>

      {dirty ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:left-60">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <p className="text-13 text-muted-foreground">Unsaved changes. Saving creates a new version.</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={reset}>
                Discard
              </Button>
              <Button onClick={save}>Save version</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
