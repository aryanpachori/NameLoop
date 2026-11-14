"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/store";
import { toast } from "sonner";

export default function LoopPage() {
  const router = useRouter();
  const { state, startNextLoop } = useWorkspace();
  const { loop, sprint } = state;
  const [confirm, setConfirm] = useState(false);
  const early = sprint.dayOf21 < 21;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Loop"
        title="Learn, then run the next 3 weeks"
        description={`Day ${sprint.dayOf21} of 21. NameLoop proposes the next sprint from what this one taught it.`}
        actions={
          <Button size="lg" onClick={() => setConfirm(true)}>
            Start next 3 weeks
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface space-y-3 p-4 sm:p-5">
          <h2 className="text-16 font-semibold">What we learned</h2>
          <ul className="space-y-2 text-14">
            {loop.learnings.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="surface space-y-3 p-4 sm:p-5">
          <h2 className="text-16 font-semibold">Proposed next sprint</h2>
          <p className="text-14">{loop.nextSprintSummary}</p>
          <p className="pt-1 text-12 text-muted-foreground">Proposed changes</p>
          <ul className="space-y-2 text-14">
            {loop.proposedChanges.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start the next 3 weeks?</AlertDialogTitle>
            <AlertDialogDescription>
              {early
                ? `You are only on day ${sprint.dayOf21}. Starting now resets the sprint to day 1.`
                : "The sprint resets to day 1. Approvals stay required."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Not yet</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                startNextLoop();
                toast.success("Next sprint started");
                router.push("/app/sprint");
              }}
            >
              Start
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
