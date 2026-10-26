"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist, readWaitlistSpot, type WaitlistSpot } from "@/lib/waitlist";

function QueueLine({ spot }: { spot: WaitlistSpot }) {
  const around = [spot.position - 2, spot.position - 1, spot.position, spot.position + 1, spot.position + 2].filter(
    (n) => n > 0
  );

  return (
    <ol className="mt-8 space-y-2">
      {around.map((n) => {
        const you = n === spot.position;
        return (
          <li
            key={n}
            className={`flex items-center justify-between rounded-[14px] px-4 py-3 ${
              you ? "bg-primary text-primary-foreground" : "bg-card text-foreground ring-1 ring-border"
            }`}
          >
            <span className="tabular-nums">{n}</span>
            <span>{you ? spot.email : "Waiting"}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [spot, setSpot] = useState<WaitlistSpot | null>(null);

  useEffect(() => {
    setSpot(readWaitlistSpot());
  }, []);

  function submit() {
    if (!email.trim()) return;
    setSpot(joinWaitlist({ email }));
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r border-border bg-muted p-10 lg:flex">
        <Link href="/">
          <Logo />
        </Link>
        <div className="max-w-sm">
          <h1 className="heading-1">
            {spot ? `You are number ${spot.position} on the list.` : "Discovery, outreach, content."}
          </h1>
          <p className="mt-4 text-[16px] text-muted-foreground">
            {spot
              ? `We will email ${spot.email} when a seat opens. First 7 days are free. Then $10 a month.`
              : "Leave your email. Discovery, outreach, content. 7 days free, then $10 a month."}
          </p>
        </div>
        <p className="text-[14px] text-muted-foreground">You pick where it runs.</p>
      </aside>
      <div className="flex flex-col justify-center bg-background px-4 py-12">
        <div className="mx-auto w-full max-w-lg">
          <Link href="/" className="mb-8 inline-block text-[14px] lg:hidden">
            <Logo />
          </Link>
          {spot ? (
            <>
              <h1 className="heading-1">You are on the list.</h1>
              <p className="mt-2 text-[16px] text-muted-foreground">
                {`Position ${spot.position}. We will email ${spot.email} when a seat opens.`}
              </p>
              <QueueLine spot={spot} />
              <p className="mt-6 text-[15px] text-muted-foreground">
                First 7 days are free. Then $10 a month.
              </p>
            </>
          ) : (
            <>
              <h1 className="heading-1">Join the waitlist</h1>
              <p className="mt-2 text-[16px] text-muted-foreground">
                Enter your email. 7 days free when you get in, then $10 a month.
              </p>
              <form
                className="mt-8 space-y-4 rounded-[16px] bg-card p-6 text-card-foreground ring-1 ring-border"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" type="submit">
                  Join the waitlist
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
