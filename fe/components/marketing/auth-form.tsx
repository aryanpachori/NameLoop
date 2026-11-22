"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export type AuthMode = "signin" | "signup";

type Props = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
};

function missingSupabaseEnvMessage() {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  if (host.includes("vercel.app") || host === "nameloop.vercel.app") {
    return "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel. Add it in Project → Settings → Environment Variables, then Redeploy.";
  }
  return "Add NEXT_PUBLIC_SUPABASE_ANON_KEY to fe/.env.local, then restart Next.";
}

export function AuthForm({ mode, onModeChange }: Props) {
  const params = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<"google" | "magic" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const productUrl = params.get("url") ?? "";
  const authError = params.get("error");

  useEffect(() => {
    emailRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

  function nextPath() {
    const q = productUrl ? `?url=${encodeURIComponent(productUrl)}` : "";
    return mode === "signup" ? `/onboarding${q}` : `/app`;
  }

  async function continueGoogle() {
    setError(null);
    if (!supabaseConfigured()) {
      setError(missingSupabaseEnvMessage());
      return;
    }
    setBusy("google");
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath())}`;
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (err) throw err;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed");
      setBusy(null);
    }
  }

  async function sendMagicLink(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const value = email.trim().toLowerCase();
    if (!value) return;

    if (!supabaseConfigured()) {
      setError(missingSupabaseEnvMessage());
      return;
    }

    setBusy("magic");
    try {
      const supabase = createClient();
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath())}`;
      const { error: err } = await supabase.auth.signInWithOtp({
        email: value,
        options: { emailRedirectTo, shouldCreateUser: true },
      });
      if (err) throw err;
      setSentTo(value);
      setResendIn(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send link");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-[10px] border border-border bg-muted/40 p-1">
        <button
          type="button"
          className={cn(
            "flex-1 rounded-[8px] px-3 py-2 text-13 font-medium transition-colors",
            mode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          )}
          onClick={() => {
            onModeChange("signin");
            setSentTo(null);
            setError(null);
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 rounded-[8px] px-3 py-2 text-13 font-medium transition-colors",
            mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          )}
          onClick={() => {
            onModeChange("signup");
            setSentTo(null);
            setError(null);
          }}
        >
          Create account
        </button>
      </div>

      {(error || authError) && (
        <p className="rounded-[8px] border border-destructive/30 bg-destructive/[0.08] px-3 py-2 text-13 text-destructive">
          {error ?? "Sign-in didn’t finish. Try again."}
        </p>
      )}

      {sentTo ? (
        <div className="surface space-y-3 p-5">
          <p className="text-14 font-medium">Check your inbox</p>
          <p className="text-14 text-muted-foreground">
            We sent a link to{" "}
            <span className="font-mono text-foreground">{sentTo}</span>. Open it on this device.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={resendIn > 0 || busy === "magic"}
            onClick={() => sendMagicLink()}
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : busy === "magic" ? "Sending…" : "Resend link"}
          </Button>
          <button
            type="button"
            className="text-13 text-muted-foreground underline underline-offset-4"
            onClick={() => setSentTo(null)}
          >
            Use a different email
          </button>
        </div>
      ) : (
        <div className="surface space-y-4 p-5">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={busy !== null}
            onClick={continueGoogle}
          >
            <span
              aria-hidden
              className="flex size-4 items-center justify-center rounded-full border border-current font-mono text-[10px] leading-none"
            >
              G
            </span>
            {busy === "google" ? "Redirecting…" : "Continue with Google"}
          </Button>

          <div className="flex items-center gap-3 text-12 text-muted-foreground">
            <span aria-hidden className="h-px flex-1 bg-border" />
            or
            <span aria-hidden className="h-px flex-1 bg-border" />
          </div>

          <form className="space-y-3" onSubmit={sendMagicLink}>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder="you@company.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />
              <p className="text-12 text-muted-foreground">
                We’ll email a magic link. No password to remember.
              </p>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={busy !== null}>
              {busy === "magic" ? "Sending…" : "Email me a link"}
            </Button>
          </form>
        </div>
      )}

      <p className="text-13 text-muted-foreground">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button
              type="button"
              className="text-foreground underline underline-offset-4"
              onClick={() => onModeChange("signup")}
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="text-foreground underline underline-offset-4"
              onClick={() => onModeChange("signin")}
            >
              Sign in
            </button>
          </>
        )}
        {" · "}
        <Link href="/" className="underline underline-offset-4">
          Home
        </Link>
      </p>

      {productUrl ? (
        <p className="text-12 text-muted-foreground">
          After sign-in we’ll open onboarding with{" "}
          <span className="font-mono text-foreground">{productUrl}</span>.
        </p>
      ) : null}
    </div>
  );
}
