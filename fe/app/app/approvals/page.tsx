import { Suspense } from "react";
import { ApprovalsInbox } from "@/components/app/approvals-inbox";

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading inbox…</p>}>
      <ApprovalsInbox />
    </Suspense>
  );
}
