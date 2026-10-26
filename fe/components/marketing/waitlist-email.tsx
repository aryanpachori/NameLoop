"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/lib/waitlist";
import { cn } from "cn";

export function WaitlistEmail({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <form
      className={cn("flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center", className)}
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim()) return;
        joinWaitlist({ email });
        router.push("/signup");
      }}
    >
      <label className="sr-only" htmlFor="waitlist-email">
        Email
      </label>
      <Input
        id="waitlist-email"
        type="email"
        autoComplete="email"
        placeholder="Enter email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className="h-11 flex-1 rounded-full bg-white px-4 text-[15px]"
      />
      <Button className="h-11 w-full shrink-0 sm:w-auto" type="submit">
        Join the waitlist
      </Button>
    </form>
  );
}
