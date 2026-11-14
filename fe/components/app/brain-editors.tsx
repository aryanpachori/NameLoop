"use client";

import { useState } from "react";
import { SourceChip } from "@/components/source-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Segmented } from "@/components/ui/segmented";
import { Textarea } from "@/components/ui/textarea";
import { FOLLOWUP_FIELDS, GOAL_OPTIONS, SIDE_OPTIONS } from "@/lib/model-config";
import type { BusinessModel, Claim, IcpCard, ModelFollowUps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-8 rounded-[8px] border px-3 text-13 font-medium transition-colors duration-150 ease-out",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

export function GoalsPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {GOAL_OPTIONS.map((goal) => {
        const active = value.includes(goal.id);
        return (
          <Chip
            key={goal.id}
            active={active}
            onClick={() =>
              onChange(active ? value.filter((id) => id !== goal.id) : [...value, goal.id])
            }
          >
            {goal.label}
          </Chip>
        );
      })}
    </div>
  );
}

export function AdBudgetSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor="ad-budget">Monthly ad budget (optional)</Label>
        <span className="font-[family-name:var(--font-geist-mono)] text-13 tabular-nums">
          {value === 0 ? "No ads" : `$${value.toLocaleString()}`}
        </span>
      </div>
      <input
        id="ad-budget"
        type="range"
        min={0}
        max={10000}
        step={250}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[var(--brand)]"
      />
      <p className="text-12 text-muted-foreground">
        Ad spend is billed by the ad platform. Ads unlock after day 21 and always need your approval.
      </p>
    </div>
  );
}

export function ModelFollowUpsForm({
  model,
  value,
  onChange,
}: {
  model: BusinessModel;
  value: ModelFollowUps;
  onChange: (next: ModelFollowUps) => void;
}) {
  const fields = FOLLOWUP_FIELDS[model];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label htmlFor={`fu-${field.key}`}>{field.label}</Label>
          <Input
            id={`fu-${field.key}`}
            value={(value[field.key] as string | undefined) ?? ""}
            placeholder={field.placeholder}
            onChange={(event) => onChange({ ...value, [field.key]: event.target.value })}
          />
        </div>
      ))}
      {model === "marketplace" ? (
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Which side do you need to grow first?</Label>
          <div>
            <Segmented
              aria-label="Marketplace side"
              value={value.marketplaceSide ?? "both"}
              onChange={(side) => onChange({ ...value, marketplaceSide: side })}
              options={SIDE_OPTIONS}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function VoiceEditor({
  samples,
  soundsLike,
  onSamples,
  onSoundsLike,
}: {
  samples: string[];
  soundsLike: string;
  onSamples: (next: string[]) => void;
  onSoundsLike: (next: string) => void;
}) {
  const padded = [0, 1, 2].map((i) => samples[i] ?? "");
  return (
    <div className="space-y-4">
      {padded.map((sample, index) => (
        <div key={index} className="space-y-1.5">
          <Label htmlFor={`voice-${index}`}>Sample post {index + 1}</Label>
          <Textarea
            id={`voice-${index}`}
            rows={2}
            className="rounded-[8px]"
            value={sample}
            placeholder="Paste something you have posted that sounds like you."
            onChange={(event) => {
              const next = [...padded];
              next[index] = event.target.value;
              onSamples(next);
            }}
          />
        </div>
      ))}
      <div className="space-y-1.5">
        <Label htmlFor="sounds-like">Sounds like</Label>
        <Input
          id="sounds-like"
          value={soundsLike}
          placeholder="A founder who closed books at 1am"
          onChange={(event) => onSoundsLike(event.target.value)}
        />
      </div>
    </div>
  );
}

export function ClaimsEditor({
  claims,
  prohibited,
  onChange,
}: {
  claims: Claim[];
  prohibited: Claim[];
  onChange: (next: { claims: Claim[]; prohibited: Claim[] }) => void;
}) {
  const [draft, setDraft] = useState("");

  function ban(claim: Claim) {
    onChange({
      claims: claims.filter((item) => item.id !== claim.id),
      prohibited: [{ ...claim, prohibited: true }, ...prohibited],
    });
  }
  function allow(claim: Claim) {
    onChange({
      claims: [{ ...claim, prohibited: false }, ...claims],
      prohibited: prohibited.filter((item) => item.id !== claim.id),
    });
  }
  function addBanned() {
    const text = draft.trim();
    if (!text) return;
    onChange({
      claims,
      prohibited: [
        {
          id: `pr-${Date.now()}`,
          text,
          prohibited: true,
          source: { label: "You added this", field: "prohibited" },
        },
        ...prohibited,
      ],
    });
    setDraft("");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-12 text-muted-foreground">
          Pulled from your site. NameLoop may use these. Ban any you do not want said.
        </p>
        {claims.length === 0 ? (
          <p className="text-13 text-muted-foreground">No claims left.</p>
        ) : null}
        {claims.map((claim) => (
          <div
            key={claim.id}
            className="surface flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1.5">
              <p className="text-14">{claim.text}</p>
              <SourceChip source={claim.source} />
            </div>
            <Button variant="outline" size="sm" onClick={() => ban(claim)}>
              Ban
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-12 text-muted-foreground">Banned. Drafts that touch these are blocked.</p>
        {prohibited.map((claim) => (
          <div
            key={claim.id}
            className="flex items-center justify-between gap-3 rounded-[12px] border border-[#B42318]/30 bg-[#FEECEC]/40 p-3 dark:bg-[#3A1512]/40"
          >
            <p className="text-14">{claim.text}</p>
            <Button variant="ghost" size="sm" onClick={() => allow(claim)}>
              Allow
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            value={draft}
            placeholder="Add something we must never claim"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                addBanned();
              }
            }}
          />
          <Button variant="outline" onClick={addBanned}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

export function IcpCardEditor({
  icp,
  selected,
  disabled,
  onToggle,
  onEdit,
}: {
  icp: IcpCard;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onEdit: (patch: Partial<IcpCard>) => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div
      className={cn(
        "surface flex flex-col gap-3 p-4",
        selected && "border-foreground ring-1 ring-foreground"
      )}
    >
      {editing ? (
        <div className="space-y-2">
          <Input
            aria-label="ICP name"
            value={icp.name}
            onChange={(event) => onEdit({ name: event.target.value })}
          />
          <Textarea
            aria-label="Who"
            rows={3}
            className="rounded-[8px]"
            value={icp.who}
            onChange={(event) => onEdit({ who: event.target.value })}
          />
          <Input
            aria-label="Why now"
            value={icp.whyNow}
            onChange={(event) => onEdit({ whyNow: event.target.value })}
          />
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-16 font-semibold">{icp.name}</h3>
            <span className="font-[family-name:var(--font-geist-mono)] text-12 tabular-nums text-muted-foreground">
              {Math.round(icp.confidence * 100)}%
            </span>
          </div>
          <p className="text-14 text-muted-foreground">{icp.who}</p>
        </div>
      )}
      <div>
        <p className="text-12 text-muted-foreground">Pains</p>
        <ul className="mt-1 space-y-0.5 text-13">
          {icp.pains.map((pain) => (
            <li key={pain}>{pain}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-12 text-muted-foreground">Hangouts</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {icp.hangouts.map((place) => (
            <span
              key={place}
              className="rounded-[8px] border border-border px-2 py-0.5 text-12"
            >
              {place}
            </span>
          ))}
        </div>
      </div>
      {!editing ? (
        <p className="text-13">
          <span className="text-muted-foreground">Why now: </span>
          {icp.whyNow}
        </p>
      ) : null}
      <p className="font-[family-name:var(--font-geist-mono)] text-12 text-muted-foreground">
        {icp.reachableSize}
      </p>
      <div className="flex flex-wrap gap-1">
        {icp.sources.map((source) => (
          <SourceChip key={`${source.label}-${source.field}`} source={source} />
        ))}
      </div>
      <div className="mt-auto flex gap-2 pt-1">
        <Button
          size="sm"
          variant={selected ? "default" : "outline"}
          disabled={disabled && !selected}
          onClick={onToggle}
        >
          {selected ? "Selected" : "Pick"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
          {editing ? "Done" : "Edit"}
        </Button>
      </div>
    </div>
  );
}
