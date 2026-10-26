"use client";

import { useState } from "react";
import Link from "next/link";
import { OwnerBadge } from "@/components/owner-badge";
import { PageHeader } from "@/components/page-header";
import { SourceChip } from "@/components/source-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/lib/store";
import { toast } from "sonner";

export default function TargetsPage() {
  const { state, wrongBuyer } = useWorkspace();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Weekly list"
        title="25 accounts this week"
        description="Each row has a score, a reason with a source, and a suggested buyer. Edit, replace, or mark the buyer wrong."
      />
      <div className="space-y-3">
        {state.accounts.map((account) => {
          const buyer = state.contacts.find((contact) => contact.id === account.buyerId);
          return (
            <Card key={account.id}>
              <CardContent className="grid gap-4 pt-1 lg:grid-cols-[160px_1fr_220px] lg:items-start">
                <div>
                  <Link href={`/app/accounts/${account.id}`} className="font-medium hover:underline">
                    {account.company}
                  </Link>
                  <p className="text-xs text-muted-foreground">{account.industry}</p>
                  <p className="mt-2 font-mono text-xs">Fit {account.score}</p>
                  <OwnerBadge owner={account.owner} className="mt-2" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-pretty">{account.whyNow}</p>
                  <SourceChip source={account.whyNowSource} />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{buyer?.name}</p>
                  <p className="text-muted-foreground">{buyer?.title}</p>
                  <p className="text-xs text-muted-foreground">{buyer?.rationale}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setOpenFor(account.id);
                      setName("");
                      setTitle("");
                    }}
                  >
                    Wrong buyer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Dialog open={Boolean(openFor)} onOpenChange={() => setOpenFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace the buyer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="buyer-name">Name</Label>
              <Input id="buyer-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyer-title">Title</Label>
              <Input id="buyer-title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!openFor || !name.trim()}
              onClick={() => {
                if (!openFor) return;
                const existing = state.contacts.find(
                  (contact) =>
                    contact.accountId === openFor &&
                    contact.name.toLowerCase() === name.trim().toLowerCase()
                );
                if (existing) {
                  wrongBuyer(openFor, existing.id);
                } else {
                  toast.message("Use an existing contact on the account for this demo.");
                }
                setOpenFor(null);
                toast.success("Buyer flagged for rewrite");
              }}
            >
              Save buyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
