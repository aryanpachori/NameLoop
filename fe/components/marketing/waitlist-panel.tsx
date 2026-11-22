"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist, readWaitlistSpot, type WaitlistSpot } from "@/lib/waitlist";

type Props = {
  initialEmail?: string;
  onBack?: () => void;
};

export function WaitlistPanel({ initialEmail = "", onBack }: Props) {
  const existing = useMemo(() => readWaitlistSpot(), []);
  const [email, setEmail] = useState(initialEmail || existing?.email || "");
  const [spot, setSpot] = useState<WaitlistSpot | null>(() => {
    if (initialEmail) return joinWaitlist({ email: initialEmail });
    return existing;
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) return;
    setSpot(joinWaitlist({ email: value }));
  }

  if (spot) {
    return (
      <div className="surface space-y-4 p-5">
        <p className="text-14 font-medium">You’re on the list</p>
        <p className="text-14 text-muted-foreground text-pretty">
          We’ll email{" "}
          <span className="font-mono text-foreground">{spot.email}</span> when a
          spot opens.
        </p>
        {onBack ? (
          <button
            type="button"
            className="text-13 text-muted-foreground underline underline-offset-4"
            onClick={onBack}
          >
            Back to sign in
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form className="surface space-y-4 p-5" onSubmit={submit}>
      <div className="space-y-1">
        <p className="text-14 font-medium">NameLoop is invite-only right now</p>
        <p className="text-13 text-muted-foreground text-pretty">
          Leave your email and we’ll let you in as we open seats.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="waitlist-email">Work email</Label>
        <Input
          id="waitlist-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
        />
      </div>
      <Button type="submit" size="lg" className="w-full">
        Join the waitlist
      </Button>
      {onBack ? (
        <button
          type="button"
          className="w-full text-center text-13 text-muted-foreground underline underline-offset-4"
          onClick={onBack}
        >
          Back to sign in
        </button>
      ) : null}
    </form>
  );
}
