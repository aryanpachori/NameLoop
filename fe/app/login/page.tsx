"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";
import { AuthBrandPanel } from "@/components/marketing/auth-brand-panel";
import { AuthForm, type AuthMode } from "@/components/marketing/auth-form";

function LoginInner() {
  const params = useSearchParams();
  const initial: AuthMode = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<AuthMode>(initial);

  return (
    <div className="grid min-h-dvh bg-background text-foreground lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <AuthBrandPanel
        headline={
          mode === "signup"
            ? "Grow your product. Start with a URL."
            : "Welcome back. Pick up the growth loop."
        }
        accentWords={mode === "signup" ? ["product."] : ["loop."]}
        body={
          mode === "signup"
            ? "Continue with Google or a magic link. Then paste your site — we sketch who to sell to."
            : "Outbound that books. Inbound that compounds. No GTM team required."
        }
      />

      <main
        id="main"
        tabIndex={-1}
        className="relative flex flex-col justify-center bg-background px-4 py-10 sm:px-8 sm:py-12"
      >
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Logo />
          </Link>

          <div className="auth-form-fade" style={{ animationDelay: "0.05s" }}>
            <p className="text-13 font-medium text-brand">
              {mode === "signup" ? "Get started" : "Welcome back"}
            </p>
            <h2 className="heading-1 mt-2">
              {mode === "signup" ? "Create your account" : "Sign in to NameLoop"}
            </h2>
            <p className="mt-2 text-14 text-muted-foreground">
              Google first. Or email a magic link — no password.
            </p>
          </div>

          <div className="mt-8 auth-form-fade" style={{ animationDelay: "0.15s" }}>
            <AuthForm mode={mode} onModeChange={setMode} />
          </div>
        </div>
      </main>

      <style>{`
        @keyframes auth-form-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .auth-form-fade {
          animation: auth-form-fade-up 0.55s cubic-bezier(0.2, 0, 0, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-form-fade {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
