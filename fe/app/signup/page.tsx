"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist, type WaitlistSpot } from "@/lib/waitlist";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

const SIGNUP_KEY = "nameloop.signup";

const STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Account" },
  { n: 2, label: "Workspace" },
  { n: 3, label: "Done" },
];

function SignupFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [website, setWebsite] = useState(() => params.get("url") ?? "");
  const [spot, setSpot] = useState<WaitlistSpot | null>(null);

  function finishAccount(value: string) {
    setEmail(value);
    setStep(2);
  }

  function finishWorkspace() {
    const name = workspace.trim();
    const site = website.trim();
    if (!name || !site) return;
    const joined = joinWaitlist({ email });
    window.localStorage.setItem(
      SIGNUP_KEY,
      JSON.stringify({ email, workspace: name, website: site, plan: params.get("plan") })
    );
    setSpot(joined);
    setStep(3);
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <aside className="hidden flex-col justify-between border-r border-border bg-muted/50 p-10 lg:flex">
        <Link href="/">
          <Logo />
        </Link>
        <div className="max-w-sm">
          <h1 className="heading-1">Start with your site. We build the GTM loop from there.</h1>
          <p className="mt-4 text-[16px] leading-6 text-muted-foreground text-pretty">
            Give us a workspace name and your website. Next you pick a business model, review the ICP cards, and
            approve the first plan.
          </p>
        </div>
        <p className="text-13 text-muted-foreground">You approve every send at the start.</p>
      </aside>

      <main id="main" tabIndex={-1} className="flex flex-col justify-center bg-background px-4 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Logo />
          </Link>

          <ol className="mb-8 flex items-center gap-2 text-13" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s.n} aria-current={step === s.n ? "step" : undefined} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full font-mono text-12 tabular-nums",
                    step > s.n
                      ? "bg-foreground text-background"
                      : step === s.n
                        ? "border border-foreground text-foreground"
                        : "border border-border text-muted-foreground"
                  )}
                >
                  {step > s.n ? <Check className="size-3" strokeWidth={3} /> : s.n}
                </span>
                <span className={step === s.n ? "font-medium" : "text-muted-foreground"}>{s.label}</span>
                {i < STEPS.length - 1 ? <span className="mx-1 h-px w-6 bg-border" /> : null}
              </li>
            ))}
          </ol>

          {step === 1 ? (
            <AccountStep onDone={finishAccount} />
          ) : step === 2 ? (
            <div>
              <h2 className="heading-1">Name your workspace.</h2>
              <p className="mt-2 text-14 text-muted-foreground">
                Signed in as <span className="font-mono text-foreground">{email}</span>.
              </p>
              <form
                className="surface mt-6 space-y-4 p-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  finishWorkspace();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="workspace">Workspace name</Label>
                  <Input
                    id="workspace"
                    name="workspace"
                    autoComplete="organization"
                    spellCheck={false}
                    placeholder="Ledgerline…"
                    value={workspace}
                    onChange={(event) => setWorkspace(event.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    name="website"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    spellCheck={false}
                    placeholder="ledgerline.dev…"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    required
                  />
                  <p className="text-12 text-muted-foreground">We read this to learn your business. Nothing is posted.</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1">
                    Create workspace
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="heading-1">{workspace || "Your workspace"} is ready.</h2>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
                {spot
                  ? `You are number ${spot.position} in line for a full seat. You can start onboarding now with the demo workspace, or we will email ${spot.email} when your seat opens.`
                  : "Start onboarding now."}
              </p>
              <dl className="surface mt-6 divide-y divide-border text-14">
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">Workspace</dt>
                  <dd className="truncate font-medium">{workspace}</dd>
                </div>
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">Website</dt>
                  <dd className="truncate font-mono text-13">{website}</dd>
                </div>
                <div className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">Waitlist</dt>
                  <dd className="font-mono text-13">{spot ? `#${spot.position}` : "Pending"}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button size="lg" className="flex-1" onClick={() => router.push("/onboarding")}>
                  Continue to onboarding
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/")}>
                  Back to site
                </Button>
              </div>
            </div>
          )}

          {step < 3 ? (
            <p className="mt-6 text-14 text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground underline underline-offset-4">
                Log in
              </Link>
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}

function AccountStep({ onDone }: { onDone: (email: string) => void }) {
  const [email, setEmail] = useState("");
  return (
    <div>
      <h2 className="heading-1">Create your account.</h2>
      <p className="mt-2 text-14 text-muted-foreground">
        Early access. We onboard in batches and confirm your place on the next screen.
      </p>
      <div className="surface mt-6 space-y-4 p-5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => onDone("you@gmail.com")}
        >
          <span
            aria-hidden
            className="flex size-4 items-center justify-center rounded-full border border-current font-mono text-[10px] leading-none"
          >
            G
          </span>
          Continue with Google
        </Button>
        <p className="text-center text-12 text-muted-foreground">Demo only. No real sign-in happens.</p>
        <div className="flex items-center gap-3 text-12 text-muted-foreground">
          <span aria-hidden className="h-px flex-1 bg-border" />
          or
          <span aria-hidden className="h-px flex-1 bg-border" />
        </div>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (email.trim()) onDone(email.trim());
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              placeholder="you@company.com…"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupFlow />
    </Suspense>
  );
}
