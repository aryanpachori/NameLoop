"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { ChannelMark } from "@/components/channel-mark";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/lib/store";
import type { AdCampaign, AdPlatform, ChannelId } from "@/lib/types";
import { toast } from "sonner";

const PLATFORM: Record<AdPlatform, { channel: ChannelId; label: string }> = {
  meta: { channel: "meta_ads", label: "Meta" },
  google: { channel: "google_ads", label: "Google" },
  linkedin: { channel: "linkedin", label: "LinkedIn" },
  tiktok: { channel: "tiktok", label: "TikTok" },
};

type Override = { budget: number; durationDays: number };

export default function AdsPage() {
  const { state, setAdStatus } = useWorkspace();
  const locked = state.sprint.dayOf21 < 21;
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Override>({ budget: 0, durationDays: 0 });

  const ads = state.ads.filter((ad) => ad.status !== "dismissed");
  const dismissed = state.ads.length - ads.length;
  const editing = state.ads.find((ad) => ad.id === editId) ?? null;

  const eff = (ad: AdCampaign): Override => overrides[ad.id] ?? { budget: ad.budget, durationDays: ad.durationDays };

  function openEdit(ad: AdCampaign) {
    setDraft(eff(ad));
    setEditId(ad.id);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ads"
        title="Boost what already worked"
        description="Ads come from your best organic posts after the sprint. Audiences come from your ICP. Ad spend is billed by the ad platform."
      />

      {locked ? (
        <div className="surface-muted flex items-start gap-3 p-4">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="text-14 font-medium">Locked until day 21</p>
            <p className="text-13 text-muted-foreground">
              You are on day {state.sprint.dayOf21}. NameLoop needs a full sprint of organic data
              before it recommends spend. These proposals are previews and can not be approved yet.
            </p>
          </div>
        </div>
      ) : null}

      {ads.length === 0 ? (
        <EmptyState
          title="No ad proposals"
          description={
            dismissed > 0
              ? "You dismissed every proposal. New ones appear after the next sprint."
              : "Proposals appear after day 21 from your best posts."
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {ads.map((ad) => {
            const cur = eff(ad);
            const low = Math.floor(cur.budget / ad.costPerResult.high);
            const high = Math.floor(cur.budget / ad.costPerResult.low);
            const platform = PLATFORM[ad.platform];
            return (
              <article key={ad.id} className={`surface space-y-4 p-4 sm:p-5 ${locked ? "opacity-70" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-13 text-muted-foreground">
                      <ChannelMark id={platform.channel} />
                      {platform.label}
                    </div>
                    <h2 className="text-16 font-semibold">{ad.postTitle}</h2>
                  </div>
                  <Badge variant="outline" className="rounded-[8px] capitalize">
                    {locked ? "Locked" : ad.status}
                  </Badge>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-13">
                  <div className="col-span-2">
                    <dt className="text-12 text-muted-foreground">Audience (from ICP)</dt>
                    <dd>{ad.audience}</dd>
                  </div>
                  <div>
                    <dt className="text-12 text-muted-foreground">Budget</dt>
                    <dd className="font-[family-name:var(--font-geist-mono)] tabular-nums">
                      ${cur.budget.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-12 text-muted-foreground">Duration</dt>
                    <dd className="font-[family-name:var(--font-geist-mono)] tabular-nums">
                      {cur.durationDays} days
                    </dd>
                  </div>
                  <div className="col-span-2 rounded-[8px] bg-muted p-3">
                    <dt className="flex items-center gap-2 text-12 text-muted-foreground">
                      Cost per {ad.costPerResult.unit}
                      <span className="rounded-[6px] border border-border px-1 uppercase">Estimate</span>
                    </dt>
                    <dd className="font-[family-name:var(--font-geist-mono)] text-14 tabular-nums">
                      ${ad.costPerResult.low}–${ad.costPerResult.high}
                      <span className="ml-2 font-sans text-12 text-muted-foreground">
                        about {low}–{high} {ad.costPerResult.unit}s. Not a forecast.
                      </span>
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  {ad.status === "proposed" ? (
                    <Button
                      disabled={locked}
                      onClick={() => {
                        setAdStatus(ad.id, "approved");
                        toast.success("Approved. Launch when your ad account is connected.");
                      }}
                    >
                      Approve
                    </Button>
                  ) : null}
                  {ad.status === "approved" ? (
                    <Button
                      disabled={locked}
                      onClick={() => {
                        setAdStatus(ad.id, "launched");
                        toast.success("Marked launched (mock). No spend happened.");
                      }}
                    >
                      Launch
                    </Button>
                  ) : null}
                  {ad.status === "launched" ? (
                    <p className="text-13 text-muted-foreground">Launched (mock).</p>
                  ) : null}
                  {ad.status !== "launched" ? (
                    <Button variant="outline" disabled={locked} onClick={() => openEdit(ad)}>
                      Edit
                    </Button>
                  ) : null}
                  {ad.status !== "launched" ? (
                    <Button
                      variant="ghost"
                      disabled={locked}
                      onClick={() => {
                        setAdStatus(ad.id, "dismissed");
                        toast.message("Dismissed");
                      }}
                    >
                      Dismiss
                    </Button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Sheet open={editing !== null} onOpenChange={(next) => !next && setEditId(null)}>
        <SheetContent className="sm:max-w-sm">
          {editing ? (
            <>
              <SheetHeader>
                <SheetTitle>Edit {editing.postTitle}</SheetTitle>
                <SheetDescription>Budget and duration. Audience follows your selected ICP.</SheetDescription>
              </SheetHeader>
              <div className="flex-1 space-y-4 px-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ad-b">Budget (USD)</Label>
                  <Input
                    id="ad-b"
                    type="number"
                    min={0}
                    value={draft.budget}
                    onChange={(event) => setDraft({ ...draft, budget: Number(event.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ad-d">Duration (days)</Label>
                  <Input
                    id="ad-d"
                    type="number"
                    min={1}
                    value={draft.durationDays}
                    onChange={(event) =>
                      setDraft({ ...draft, durationDays: Number(event.target.value) })
                    }
                  />
                </div>
              </div>
              <SheetFooter>
                <Button
                  onClick={() => {
                    setOverrides((prev) => ({ ...prev, [editing.id]: draft }));
                    setEditId(null);
                    toast.success("Updated (this session only)");
                  }}
                >
                  Apply
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
