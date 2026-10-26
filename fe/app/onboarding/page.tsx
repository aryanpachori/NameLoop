"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { SourceChip } from "@/components/source-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/lib/store";

const chatScript = [
  {
    q: "Who feels the pain on a Tuesday, not just the buyer on the contract?",
    field: "icp" as const,
    fallback:
      "Finance ops and controllers at B2B SaaS companies with 40–400 employees still closing in Sheets.",
  },
  {
    q: "What must we never claim?",
    field: "voice" as const,
    fallback: "Don't promise ROI. Don't invent customer logos.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { state, updateBrain } = useWorkspace();
  const [step, setStep] = useState<"scan" | "confirm" | "chat">("scan");
  const [answers, setAnswers] = useState<string[]>([""]);
  const [scanning, setScanning] = useState(false);

  const extracted = useMemo(
    () => [
      { label: "Offer", value: state.brain.offer.value, source: state.brain.offer.source },
      { label: "ICP", value: state.brain.icp.value, source: state.brain.icp.source },
      { label: "Voice", value: state.brain.voice.value, source: state.brain.voice.source },
      ...state.brain.proof.map((item) => ({
        label: "Proof",
        value: item.value,
        source: item.source,
      })),
    ],
    [state.brain]
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-8">
      <Logo />
      <p className="mt-8 text-[15px] text-clay">
        Onboarding, {step}
      </p>
      <h1 className="heading-1 mt-2">
        {step === "scan" && "Reading your site for offer, audience, and claims."}
        {step === "confirm" && "Check each field and where it came from."}
        {step === "chat" && "Answer what the site left out, then save."}
      </h1>

      {step === "scan" ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Website scan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Reading {state.tenant.productUrl} for product, pricing, tone, proof and socials.
            </p>
            <Button
              disabled={scanning}
              onClick={() => {
                setScanning(true);
                window.setTimeout(() => {
                  setScanning(false);
                  setStep("confirm");
                }, 700);
              }}
            >
              {scanning ? "Extracting…" : "Extract fields"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {step === "confirm" ? (
        <div className="mt-8 space-y-3">
          {extracted.map((field) => (
            <Card key={field.label + field.value}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <CardTitle className="text-base text-pretty">{field.value}</CardTitle>
                </div>
                <SourceChip source={field.source} />
              </CardHeader>
            </Card>
          ))}
          <Button className="mt-2" onClick={() => setStep("chat")}>
            Looks right. Ask the rest
          </Button>
        </div>
      ) : null}

      {step === "chat" ? (
        <div className="mt-8 space-y-4">
          {chatScript.map((item, index) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={answers[index] ?? ""}
                  placeholder={item.fallback}
                  onChange={(event) => {
                    const next = [...answers];
                    next[index] = event.target.value;
                    setAnswers(next);
                  }}
                />
              </CardContent>
            </Card>
          ))}
          <Button
            onClick={() => {
              updateBrain({
                icp: {
                  ...state.brain.icp,
                  value: answers[0] || chatScript[0].fallback,
                  source: { label: "Interview", field: "icp" },
                },
                voice: {
                  ...state.brain.voice,
                  value: `${state.brain.voice.value} ${answers[1] || chatScript[1].fallback}`,
                  source: { label: "Interview", field: "voice" },
                },
              });
              router.push("/app/brain");
            }}
          >
            Lock version {state.brain.version + 1} and open the Brain
          </Button>
        </div>
      ) : null}
    </div>
  );
}
