"use client";

import { PageHeader } from "@/components/page-header";
import { SourceChip } from "@/components/source-chip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/lib/store";

export default function BrainPage() {
  const { state, updateBrain } = useWorkspace();
  const { brain } = state;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Business Brain"
        title={`Version ${brain.version}`}
        description="Offer, audience, voice, proof, and claims we are not allowed to make. Lasting preferences update this file. One-off edits do not."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle>Offer</CardTitle>
            <SourceChip source={brain.offer.source} />
          </CardHeader>
          <CardContent>
            <Label className="sr-only" htmlFor="offer">
              Offer
            </Label>
            <Textarea
              id="offer"
              rows={5}
              value={brain.offer.value}
              onChange={(event) =>
                updateBrain({
                  offer: { ...brain.offer, value: event.target.value },
                })
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle>ICP</CardTitle>
            <SourceChip source={brain.icp.source} />
          </CardHeader>
          <CardContent>
            <Textarea
              rows={5}
              value={brain.icp.value}
              onChange={(event) =>
                updateBrain({
                  icp: { ...brain.icp, value: event.target.value },
                })
              }
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle>Voice</CardTitle>
            <SourceChip source={brain.voice.source} />
          </CardHeader>
          <CardContent>
            <Textarea
              rows={4}
              value={brain.voice.value}
              onChange={(event) =>
                updateBrain({
                  voice: { ...brain.voice, value: event.target.value },
                })
              }
            />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Claims library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brain.claims.map((claim) => (
              <div key={claim.id} className="space-y-2 rounded-[14px] bg-muted p-4">
                <p className="text-sm">{claim.text}</p>
                <SourceChip source={claim.source} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prohibited</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brain.prohibited.map((claim) => (
              <div key={claim.id} className="space-y-2 rounded-lg border border-destructive/20 p-3">
                <p className="text-sm">{claim.text}</p>
                <SourceChip source={claim.source} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proof</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brain.proof.map((item) => (
              <div key={item.value} className="space-y-2">
                <p className="text-sm">{item.value}</p>
                <SourceChip source={item.source} />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Competitors</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {brain.competitors.map((name) => (
              <Badge key={name} variant="secondary">
                {name}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lasting preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {brain.lastingPreferences.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>One-off feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>These do not rewrite the Brain.</p>
            {brain.oneOffFeedback.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
