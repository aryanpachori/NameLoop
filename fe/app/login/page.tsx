"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/signup" className="text-14 text-muted-foreground hover:text-foreground">
          Sign up
        </Link>
      </header>
      <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <h1 className="heading-1">Log in</h1>
          <p className="mt-2 text-14 text-muted-foreground">
            Demo: any email opens the sample workspace.
          </p>
          <form
            className="surface mt-6 space-y-4 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              router.push("/app");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
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
              Log in
            </Button>
          </form>
          <p className="mt-6 text-14 text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="text-foreground underline underline-offset-4">
              Get started
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
