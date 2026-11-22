"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 shrink-0" width={16} height={16}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthForm({ mode, onModeChange }: Props) {
  const params = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productUrl = params.get("url");
  const authError = params.get("error");

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
    setBusy(true);
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
      setBusy(false);
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

      <div className="surface space-y-4 p-5">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={busy}
          onClick={continueGoogle}
        >
          <GoogleMark />
          {busy ? "Opening Google…" : "Continue with Google"}
        </Button>
      </div>

      <p className="text-13 text-muted-foreground">
        {mode === "signin" ? (
          <>
            No account?{" "}
            <button
              type="button"
              className="text-foreground underline underline-offset-4"
              onClick={() => onModeChange("signup")}
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Have an account?{" "}
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
    </div>
  );
}
