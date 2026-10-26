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
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r border-border bg-muted p-10 lg:flex">
        <Link href="/">
          <Logo />
        </Link>
        <div className="max-w-sm">
          <h1 className="heading-1">Log in to the Today queue.</h1>
          <p className="mt-4 text-[16px] text-muted-foreground text-pretty">
            This is a demo. Any email opens the sample Ledgerline workspace.
          </p>
        </div>
        <p className="text-[14px] text-muted-foreground">Approved email saves to Gmail drafts. You send it.</p>
      </aside>
      <div className="flex flex-col justify-center bg-background px-4 py-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-block text-[14px] lg:hidden">
            <Logo />
          </Link>
          <h1 className="heading-1">Log in to Today.</h1>
          <p className="mt-2 text-[14px] text-muted-foreground text-pretty">
            Demo: any email opens the sample Ledgerline workspace.
          </p>
          <form
            className="mt-8 space-y-4 rounded-[16px] bg-card p-6 text-card-foreground ring-1 ring-border"
            onSubmit={(event) => {
              event.preventDefault();
              router.push("/app");
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="maya@ledgerline.dev" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="draft-first" required />
            </div>
            <Button
              className="w-full rounded-[22px]"
              type="submit"
              onClick={() => router.push("/app")}
            >
              Open Today
            </Button>
          </form>
          <p className="mt-6 text-[14px] text-muted-foreground">
            New here? <Link href="/signup" className="text-foreground underline">Join the waitlist</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
