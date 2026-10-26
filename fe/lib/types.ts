export type Owner = "ai" | "human";

export type RecordState =
  | "ai_working"
  | "waiting_approval"
  | "needs_human"
  | "human_owned"
  | "paused";

export type PipelineStage =
  | "identified"
  | "warming"
  | "contacted"
  | "replied"
  | "discovery"
  | "meeting"
  | "won"
  | "lost";

export type Channel = "email" | "linkedin" | "instagram";

export type DraftKind =
  | "email"
  | "linkedin_message"
  | "linkedin_comment"
  | "linkedin_post"
  | "instagram_caption"
  | "instagram_dm";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type Actor = "ai" | "human";

export type SourceRef = {
  label: string;
  href?: string;
  field?: string;
};

export type Tenant = {
  id: string;
  name: string;
  productUrl: string;
  paused: boolean;
  sendingCap: number;
  usedSends: number;
  bounceRate: number;
  spamRate: number;
  domainHealth: "healthy" | "watch" | "paused";
  monthlyBudget: number;
  spent: number;
};

export type BrainField = {
  value: string;
  source: SourceRef;
};

export type Claim = {
  id: string;
  text: string;
  source: SourceRef;
  prohibited?: boolean;
};

export type BusinessBrain = {
  version: number;
  updatedAt: string;
  offer: BrainField;
  icp: BrainField;
  voice: BrainField;
  proof: BrainField[];
  claims: Claim[];
  prohibited: Claim[];
  competitors: string[];
  lastingPreferences: string[];
  oneOffFeedback: string[];
};

export type Account = {
  id: string;
  company: string;
  domain: string;
  industry: string;
  stage: PipelineStage;
  score: number;
  owner: Owner;
  state: RecordState;
  reason: string;
  nextAction: string;
  dueAt: string;
  whyNow: string;
  whyNowSource: SourceRef;
  buyerId: string | null;
  highValue?: boolean;
};

export type Contact = {
  id: string;
  accountId: string;
  name: string;
  title: string;
  email?: string;
  rationale: string;
  isBuyer: boolean;
};

export type Signal = {
  id: string;
  accountId: string;
  kind: "trigger" | "engagement" | "reply";
  summary: string;
  source: SourceRef;
};

export type Touch = {
  id: string;
  accountId: string;
  at: string;
  channel: Channel | "note" | "call";
  actor: Actor;
  summary: string;
};

export type Draft = {
  id: string;
  accountId: string | null;
  kind: DraftKind;
  channel: Channel;
  subject?: string;
  body: string;
  signalId: string | null;
  claimIds: string[];
  flaggedClaims: string[];
  status: ApprovalStatus;
  rejectReason?: string;
  createdAt: string;
  scheduledFor?: string;
};

export type QueueItem = {
  id: string;
  accountId: string | null;
  draftId?: string;
  title: string;
  reason: string;
  urgency: "now" | "today" | "week";
  dueAt: string;
  actionLabel: string;
  href: string;
};

export type DiscoverySummary = {
  accountId: string;
  pain: string;
  impact: string;
  workaround: string;
  timeline: string;
  budgetOwner: string;
  confidence: number;
};

export type MeetingBrief = {
  accountId: string;
  at: string;
  angle: string;
  questions: string[];
};

export type Suppression = {
  id: string;
  value: string;
  reason: string;
};

export type Connector = {
  id: string;
  name: string;
  status: "connected" | "error" | "disconnected";
  lastError?: string;
};

export type AuditEvent = {
  id: string;
  at: string;
  actor: Actor;
  action: string;
  detail: string;
};

export type WeeklyReport = {
  weekOf: string;
  accountsFound: number;
  contacted: number;
  replies: number;
  positiveReplies: number;
  meetings: number;
  contentViews: number;
  contentSaves: number;
  interventionRate: number;
  takeaways: string[];
};

export type WorkspaceState = {
  tenant: Tenant;
  brain: BusinessBrain;
  accounts: Account[];
  contacts: Contact[];
  signals: Signal[];
  touches: Touch[];
  drafts: Draft[];
  queue: QueueItem[];
  discoveries: DiscoverySummary[];
  meetings: MeetingBrief[];
  suppressions: Suppression[];
  connectors: Connector[];
  audit: AuditEvent[];
  report: WeeklyReport;
  onboarded: boolean;
};

export type SignupDraft = {
  url: string;
  offer: string;
  audience: string;
  weakFit: boolean;
};
