"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { LoopMark } from "@/components/loop-mark";
import { WordReveal } from "@/components/marketing/word-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PATHWAY = [
  { n: "01", label: "Who might buy" },
  { n: "02", label: "Where they hang out" },
  { n: "03", label: "What to post" },
  { n: "04", label: "Meetings in" },
] as const;

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <aside className="relative hidden overflow-hidden border-r border-border lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 10%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, color-mix(in oklab, var(--brand) 10%, transparent), transparent 50%), var(--muted)",
          }}
        />
        <div
          aria-hidden
          className="login-orbit pointer-events-none absolute -right-16 top-1/4 size-[28rem] rounded-full border border-border/60"
        />
        <div
          aria-hidden
          className="login-orbit-slow pointer-events-none absolute -left-24 bottom-8 size-[22rem] rounded-full border border-dashed border-border/50"
        />

        <div className="relative z-10 p-10">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="relative z-10 max-w-md px-10 pb-6">
          <LoopMark size={56} className="mb-8" />
          <h1 className="heading-1">
            <WordReveal
              text="Your pathway to meetings that show up."
              accentWords={["meetings"]}
              instant
              stagger={0.06}
            />
          </h1>
          <p
            className="mt-4 text-16 text-muted-foreground text-pretty login-fade"
            style={{ animationDelay: "0.45s" }}
          >
            Inbound first. Open your workspace and pick up the loop where you left it.
          </p>

          <ol className="mt-10 space-y-3" aria-label="The NameLoop pathway">
            {PATHWAY.map((step, i) => (
              <li
                key={step.n}
                className="login-fade flex items-baseline gap-4"
                style={{ animationDelay: `${0.55 + i * 0.08}s` }}
              >
                <span className="font-mono text-12 tabular-nums text-brand">{step.n}</span>
                <span className="text-15 font-medium text-foreground">{step.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="relative z-10 px-10 pb-10 text-13 text-muted-foreground">
          Nothing goes live until you approve.
        </p>
      </aside>

      <main
        id="main"
        tabIndex={-1}
        className="relative flex flex-col justify-center bg-background px-4 py-10 sm:px-8 sm:py-12"
      >
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Logo />
          </Link>

          <div className="login-fade" style={{ animationDelay: "0.05s" }}>
            <p className="text-13 font-medium text-brand">Welcome back</p>
            <h2 className="heading-1 mt-2">Log in to NameLoop</h2>
            <p className="mt-2 text-14 text-muted-foreground">
              Demo: any email opens the sample workspace.
            </p>
          </div>

          <div
            className="surface mt-8 space-y-4 p-5 login-fade"
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
            className="mt-6 text-14 text-muted-foreground login-fade"
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
        @keyframes login-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes login-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .login-fade {
          animation: login-fade-up 0.55s cubic-bezier(0.2, 0, 0, 1) both;
        }
        .login-orbit {
          animation: login-orbit 48s linear infinite;
        }
        .login-orbit-slow {
          animation: login-orbit 72s linear infinite reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .login-fade,
          .login-orbit,
          .login-orbit-slow {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
