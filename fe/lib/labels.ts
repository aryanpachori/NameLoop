import type { DraftKind, PipelineStage, RecordState } from "@/lib/types";

export const STAGE_LABELS: Record<PipelineStage, string> = {
  identified: "Identified",
  warming: "Warming",
  contacted: "Contacted",
  replied: "Replied",
  discovery: "Discovery",
  meeting: "Meeting",
  won: "Won",
  lost: "Lost",
};

export const STAGES: PipelineStage[] = [
  "identified",
  "warming",
  "contacted",
  "replied",
  "discovery",
  "meeting",
  "won",
  "lost",
];

export const STATE_LABELS: Record<RecordState, string> = {
  ai_working: "AI working",
  waiting_approval: "Waiting for approval",
  needs_human: "Needs human",
  human_owned: "Human-owned",
  paused: "Paused",
};

export const KIND_LABELS: Record<DraftKind, string> = {
  email: "Email draft",
  linkedin_message: "LinkedIn message",
  linkedin_comment: "LinkedIn comment",
  linkedin_post: "LinkedIn post",
  instagram_caption: "Instagram caption",
  instagram_dm: "Instagram DM",
};

export function formatDue(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
