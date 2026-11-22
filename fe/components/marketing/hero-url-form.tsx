"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function HeroUrlForm({ className }: { className?: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");

  return (
    <form
      className={cn("flex w-full max-w-xl flex-col gap-2 sm:flex-row", className)}
      onSubmit={(event) => {
        event.preventDefault();
        const value = url.trim();
        router.push(value ? `/signup?url=${encodeURIComponent(value)}` : "/signup");
      }}
    >
      <label htmlFor="hero-url" className="sr-only">
        Paste your product URL
      </label>
      <Input
        id="hero-url"
        name="url"
        type="text"
        inputMode="url"
        autoComplete="url"
        spellCheck={false}
        placeholder="yourproduct.com…"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        className="h-11 w-full bg-card px-3.5 text-16 sm:flex-1 md:text-15"
      />
      <Button type="submit" size="lg" className="h-11 w-full px-5 sm:w-auto">
        Get started
        <ArrowRight data-icon="inline-end" />
      </Button>
    </form>
  );
}
