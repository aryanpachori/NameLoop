"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OwnerBadge } from "@/components/owner-badge";
import { PageHeader } from "@/components/page-header";
import { StateBadge } from "@/components/state-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { STAGE_LABELS, STAGES } from "@/lib/labels";
import { useWorkspace } from "@/lib/store";

export default function PipelinePage() {
  const { state, moveStage } = useWorkspace();
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const grouped = useMemo(
    () =>
      STAGES.map((stage) => ({
        stage,
        accounts: state.accounts.filter((account) => account.stage === stage),
      })),
    [state.accounts]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Accounts by stage"
        description="Each card shows who owns it. Drag a card to move the stage."
        actions={
          <>
            <Button variant={view === "kanban" ? "default" : "outline"} onClick={() => setView("kanban")}>
              Kanban
            </Button>
            <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>
              List
            </Button>
          </>
        }
      />
      {view === "kanban" ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {grouped.map((column) => (
            <section
              key={column.stage}
              className="w-72 shrink-0 rounded-xl bg-muted/30 p-2"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                const id = event.dataTransfer.getData("text/account");
                if (id) moveStage(id, column.stage);
              }}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-sm font-medium">{STAGE_LABELS[column.stage]}</h2>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {column.accounts.length}
                </span>
              </div>
              <div className="space-y-2">
                {column.accounts.map((account) => (
                  <Card
                    key={account.id}
                    className="cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/account", account.id);
                    }}
                  >
                    <CardContent className="space-y-2">
                      <Link href={`/app/accounts/${account.id}`} className="font-medium hover:underline">
                        {account.company}
                      </Link>
                      <p className="text-xs text-muted-foreground">{account.reason}</p>
                      <div className="flex flex-wrap gap-1">
                        <OwnerBadge owner={account.owner} />
                        <StateBadge state={account.state} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[14px] bg-card">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-3 py-2 font-medium">Account</th>
                <th className="px-3 py-2 font-medium">Stage</th>
                <th className="px-3 py-2 font-medium">Owner</th>
                <th className="px-3 py-2 font-medium">State</th>
                <th className="px-3 py-2 font-medium">Next</th>
              </tr>
            </thead>
            <tbody>
              {state.accounts.map((account) => (
                <tr key={account.id} className="border-b border-border">
                  <td className="px-3 py-3">
                    <Link href={`/app/accounts/${account.id}`} className="hover:underline">
                      {account.company}
                    </Link>
                  </td>
                  <td className="px-3 py-3">{STAGE_LABELS[account.stage]}</td>
                  <td className="px-3 py-3">
                    <OwnerBadge owner={account.owner} />
                  </td>
                  <td className="px-3 py-3">
                    <StateBadge state={account.state} />
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{account.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
