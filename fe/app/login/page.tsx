"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { AuthBrandPanel } from "@/components/marketing/auth-brand-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="grid min-h-dvh bg-background text-foreground lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <AuthBrandPanel
        headline="Your pathway to meetings that show up."
        accentWords={["meetings"]}
        body="Inbound first. Open your workspace and pick up the loop where you left it."
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
            <p className="text-13 font-medium text-brand">Welcome back</p>
            <h2 className="heading-1 mt-2">Log in to NameLoop</h2>
            <p className="mt-2 text-14 text-muted-foreground">
              Demo: any email opens the sample workspace.
            </p>
          </div>

          <div
            className="surface mt-8 space-y-4 p-5 auth-form-fade"
            style={{ animationDelay: "0.15s" }}
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push("/app")}
            >
              <span
                aria-hidden
                className="flex size-4 items-center justify-center rounded-full border border-current font-mono text-[10px] leading-none"
              >
                G
              </span>
              Continue with Google
            </Button>
            <p className="text-center text-12 text-muted-foreground">
              Demo only. No real sign-in happens.
            </p>

            <div className="flex items-center gap-3 text-12 text-muted-foreground">
              <span aria-hidden className="h-px flex-1 bg-border" />
              or
              <span aria-hidden className="h-px flex-1 bg-border" />
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                router.push("/app");
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
                  defaultValue="maya@ledgerline.dev"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-12 text-muted-foreground">Demo password filled</span>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  defaultValue="demo-password"
                  required
                />
              </div>
              <Button className="w-full" size="lg" type="submit">
                Continue to workspace
              </Button>
            </form>
          </div>

          <p
            className="mt-6 text-14 text-muted-foreground auth-form-fade"
            style={{ animationDelay: "0.28s" }}
          >
            New here?{" "}
            <Link href="/signup" className="text-foreground underline underline-offset-4">
              Get started
            </Link>
          </p>
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
