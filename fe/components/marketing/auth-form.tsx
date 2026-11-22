"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

type FieldErrors = {
  email?: string;
  password?: string;
  confirm?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

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

function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Email is required.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email.";
  return undefined;
}

function validatePassword(value: string, mode: AuthMode): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 6) return "At least 6 characters.";
  if (mode === "signup") {
    if (value.length < 8) return "At least 8 characters.";
    if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
      return "Use letters and a number.";
    }
  }
  return undefined;
}

function validateConfirm(password: string, confirm: string, mode: AuthMode): string | undefined {
  if (mode !== "signup") return undefined;
  if (!confirm) return "Confirm your password.";
  if (confirm !== password) return "Passwords don’t match.";
  return undefined;
}

export function AuthForm({ mode, onModeChange }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState<"google" | "password" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; confirm?: boolean }>(
    {}
  );

  const productUrl = params.get("url");
  const authError = params.get("error");

  useEffect(() => {
    emailRef.current?.focus();
  }, [mode]);

  function nextPath() {
    const q = productUrl ? `?url=${encodeURIComponent(productUrl)}` : "";
    return mode === "signup" ? `/onboarding${q}` : `/app`;
  }

  function clearFieldNoise() {
    setError(null);
    setNotice(null);
    setFieldErrors({});
    setTouched({});
  }

  function runFieldValidation(next?: {
    email?: string;
    password?: string;
    confirm?: string;
  }): FieldErrors {
    const e = next?.email ?? email;
    const p = next?.password ?? password;
    const c = next?.confirm ?? confirm;
    const errors: FieldErrors = {
      email: validateEmail(e),
      password: validatePassword(p, mode),
      confirm: validateConfirm(p, c, mode),
    };
    setFieldErrors(errors);
    return errors;
  }

  async function continueGoogle() {
    setError(null);
    setNotice(null);
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

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setTouched({ email: true, password: true, confirm: mode === "signup" });

    const errors = runFieldValidation();
    if (errors.email || errors.password || errors.confirm) {
      if (errors.email) emailRef.current?.focus();
      return;
    }

    if (!supabaseConfigured()) {
      setError(missingSupabaseEnvMessage());
      return;
    }

    const value = email.trim().toLowerCase();
    setBusy("password");
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: value,
          password,
        });
        if (err) throw err;
        if (data.session) {
          router.push(nextPath());
          router.refresh();
          return;
        }
        setNotice("Account created. Sign in with your email and password.");
        onModeChange("signin");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: value,
          password,
        });
        if (err) throw err;
        router.push(nextPath());
        router.refresh();
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Could not sign in";
      const lower = raw.toLowerCase();
      if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
        setError("Wrong email or password.");
      } else if (lower.includes("already registered") || lower.includes("already been registered")) {
        setFieldErrors((prev) => ({ ...prev, email: "That email already has an account." }));
      } else if (lower.includes("password")) {
        setFieldErrors((prev) => ({ ...prev, password: raw }));
      } else {
        setError(raw);
      }
    } finally {
      setBusy(null);
    }
  }

  const emailInvalid = Boolean(touched.email && fieldErrors.email);
  const passwordInvalid = Boolean(touched.password && fieldErrors.password);
  const confirmInvalid = Boolean(touched.confirm && fieldErrors.confirm);

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
            clearFieldNoise();
            setConfirm("");
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
            clearFieldNoise();
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

      {notice ? (
        <p className="rounded-[8px] border border-border bg-muted/40 px-3 py-2 text-13 text-muted-foreground">
          {notice}
        </p>
      ) : null}

      <div className="surface space-y-4 p-5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled={busy !== null}
          onClick={continueGoogle}
        >
          <GoogleMark />
          {busy === "google" ? "Opening Google…" : "Continue with Google"}
        </Button>

        <div className="flex items-center gap-3 text-12 text-muted-foreground">
          <span aria-hidden className="h-px flex-1 bg-border" />
          or
          <span aria-hidden className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-3" onSubmit={submitPassword} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
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
              className="h-11 px-3.5"
              aria-invalid={emailInvalid || undefined}
              aria-describedby={emailInvalid ? "email-error" : undefined}
              onChange={(ev) => {
                const next = ev.target.value;
                setEmail(next);
                if (touched.email) {
                  setFieldErrors((prev) => ({ ...prev, email: validateEmail(next) }));
                }
              }}
              onBlur={() => {
                setTouched((t) => ({ ...t, email: true }));
                setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }));
              }}
              required
            />
            {emailInvalid ? (
              <p id="email-error" className="text-12 text-destructive">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="••••••••"
              value={password}
              className="h-11 px-3.5"
              aria-invalid={passwordInvalid || undefined}
              aria-describedby={passwordInvalid ? "password-error" : undefined}
              onChange={(ev) => {
                const next = ev.target.value;
                setPassword(next);
                if (touched.password || touched.confirm) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    password: validatePassword(next, mode),
                    confirm: validateConfirm(next, confirm, mode),
                  }));
                }
              }}
              onBlur={() => {
                setTouched((t) => ({ ...t, password: true }));
                setFieldErrors((prev) => ({
                  ...prev,
                  password: validatePassword(password, mode),
                }));
              }}
              required
              minLength={mode === "signup" ? 8 : 6}
            />
            {passwordInvalid ? (
              <p id="password-error" className="text-12 text-destructive">
                {fieldErrors.password}
              </p>
            ) : mode === "signup" && !touched.password ? (
              <p className="text-12 text-muted-foreground">8+ characters, letters and a number.</p>
            ) : null}
          </div>

          {mode === "signup" ? (
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                className="h-11 px-3.5"
                aria-invalid={confirmInvalid || undefined}
                aria-describedby={confirmInvalid ? "confirm-error" : undefined}
                onChange={(ev) => {
                  const next = ev.target.value;
                  setConfirm(next);
                  if (touched.confirm) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirm: validateConfirm(password, next, mode),
                    }));
                  }
                }}
                onBlur={() => {
                  setTouched((t) => ({ ...t, confirm: true }));
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirm: validateConfirm(password, confirm, mode),
                  }));
                }}
                required
              />
              {confirmInvalid ? (
                <p id="confirm-error" className="text-12 text-destructive">
                  {fieldErrors.confirm}
                </p>
              ) : null}
            </div>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={busy !== null}>
            {busy === "password"
              ? mode === "signup"
                ? "Creating…"
                : "Signing in…"
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>
      </div>

      <p className="text-13 text-muted-foreground">
        {mode === "signin" ? (
          <>
            No account?{" "}
            <button
              type="button"
              className="text-foreground underline underline-offset-4"
              onClick={() => {
                onModeChange("signup");
                clearFieldNoise();
              }}
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
              onClick={() => {
                onModeChange("signin");
                clearFieldNoise();
                setConfirm("");
              }}
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
