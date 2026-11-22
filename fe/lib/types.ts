export type Owner = "ai" | "human";

export type BusinessModel = "b2b" | "b2c" | "d2c" | "b2b2c" | "marketplace";

export type RecordState =
  | "ai_working"
  | "waiting_approval"
  | "needs_human"
  | "human_owned"
  | "paused"
  | "live"
  | "scheduled"
  | "failed";

export type ChannelId =
  | "email"
  | "linkedin"
  | "x"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "reddit"
  | "whatsapp"
  | "google_ads"
  | "meta_ads";

/** @deprecated Prefer ChannelId. Kept for legacy Touch/Draft rows. */
export type Channel = "email" | "linkedin" | "instagram";

export type PipelineStage =
  | "identified"
  | "warming"
  | "contacted"
  | "replied"
  | "discovery"
  | "meeting"
  | "won"
  | "lost";

/** Outbound send-machine stages (Mayson-style tracker). */
export type TrackerStage =
  | "ready_to_send"
  | "sent"
  | "follow_up_1"
  | "follow_up_2"
  | "follow_up_3"
  | "follow_up_4"
  | "follow_up_5"
  | "completed"
  | "bounced"
  | "unsubscribed"
  | "replied"
  | "no_email"
  | "disqualified";

export type SenderId = "gmail" | "resend";

export type SequenceKind = "E1" | "FU1" | "FU2" | "FU3" | "FU4" | "FU5";

export type GtmSender = {
  id: SenderId;
  label: string;
  email: string;
  replyTo?: string;
  status: "active" | "paused" | "warming";
  dailyCap: number;
  usedToday: number;
  bounceRate: number;
  warmup: "cold" | "warming" | "ready";
};

export type GtmSlot = {
  id: string;
  hourIst: 10 | 12 | 14 | 16 | 18;
  label: string;
  planned: number;
  sent: number;
  role: "source" | "send";
};

export type GtmMachine = {
  hardDailyCap: number;
  usedToday: number;
  schedule: "mon_sat";
  timezone: "Asia/Kolkata";
  bouncePauseAt: number;
  paused: boolean;
  pausedReason?: string;
  senders: GtmSender[];
  slots: GtmSlot[];
  source: {
    mode: "scrape" | "apify" | "upload";
    lastPullAt?: string;
    lastPullCount?: number;
  };
};

export type DraftKind =
  | "email"
  | "linkedin_message"
  | "linkedin_comment"
  | "linkedin_post"
  | "instagram_caption"
  | "instagram_dm"
  | "tiktok_caption"
  | "x_post"
  | "ad_copy";

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
  businessModel: BusinessModel;
  paused: boolean;
  sendingCap: number;
  usedSends: number;
  postsCap: number;
  usedPosts: number;
  seats: number;
  bounceRate: number;
  spamRate: number;
  domainHealth: "healthy" | "watch" | "paused";
  monthlyBudget: number;
  spent: number;
  autopilotTrusted: boolean;
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

export type IcpCard = {
  id: string;
  name: string;
  who: string;
  pains: string[];
  hangouts: string[];
  whyNow: string;
  reachableSize: string;
  confidence: number;
  sources: SourceRef[];
};

export type ModelFollowUps = {
  dealSize?: string;
  salesCycle?: string;
  buyerTitle?: string;
  pricePoint?: string;
  purchaseFrequency?: string;
  sellWhere?: string;
  marketplaceSide?: "supply" | "demand" | "both";
};

export type BusinessBrain = {
  version: number;
  updatedAt: string;
  businessModel: BusinessModel;
  modelFollowUps: ModelFollowUps;
  goals: string[];
  monthlyAdBudget?: number;
  voiceSamples: string[];
  soundsLike: string;
  offer: BrainField;
  icp: BrainField;
  voice: BrainField;
  proof: BrainField[];
  claims: Claim[];
  prohibited: Claim[];
  competitors: string[];
  lastingPreferences: string[];
  oneOffFeedback: string[];
  icps: IcpCard[];
  selectedIcpIds: string[];
  history: { version: number; at: string; note: string }[];
};

export type Account = {
  id: string;
  company: string;
  domain: string;
  industry: string;
  stage: PipelineStage;
  /** Send-machine stage for the lead board / sequence. */
  trackerStage: TrackerStage;
  sender?: SenderId;
  qualify?: "ok" | "no_email" | "bad_mx" | "agent_mailbox";
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
  channel: Channel | ChannelId | "note" | "call";
  actor: Actor;
  summary: string;
};

export type Draft = {
  id: string;
  accountId: string | null;
  kind: DraftKind;
  channel: Channel | ChannelId;
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
  channelId?: ChannelId;
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
  byChannel: { channel: ChannelId; reach: number; replies: number; delta: string }[];
  bestPosts: {
    id: string;
    title: string;
    channel: ChannelId;
    why: string;
    metric: string;
  }[];
};

export type ChannelConnection = {
  id: string;
  channelId: ChannelId;
  status: "connected" | "needs_reauth" | "disconnected";
  detail?: string;
  sendingDomain?: string;
  warmup?: "cold" | "warming" | "ready";
  health?: "healthy" | "watch" | "paused";
};

export type ChannelRecommendation = {
  channelId: ChannelId;
  fitScore: number;
  why: string;
  source: SourceRef;
  effortPerWeek: string;
  expectedOutcome: string;
};

export type SprintPostStatus =
  | "draft"
  | "waiting_approval"
  | "scheduled"
  | "posted"
  | "failed";

export type SprintPost = {
  id: string;
  day: number;
  channelId: ChannelId;
  title: string;
  body: string;
  status: SprintPostStatus;
  scheduledAt?: string;
};

export type SprintPlan = {
  id: string;
  startDate: string;
  dayOf21: number;
  autopilot: boolean;
  posts: SprintPost[];
};

export type OutreachStep = {
  id: string;
  day: number;
  channelId: ChannelId;
  kind?: SequenceKind;
  label: string;
  body: string;
  subject?: string;
};

export type OutreachProspect = {
  id: string;
  name: string;
  title: string;
  company: string;
  accountId?: string;
  state: RecordState;
  trackerStage?: TrackerStage;
  sender?: SenderId;
  nextStep: string;
};

export type OutreachSequence = {
  id: string;
  name: string;
  kind: "b2b_sequence" | "d2c_creator";
  dailyCap: number;
  usedToday: number;
  steps: OutreachStep[];
  prospects: OutreachProspect[];
};

export type AdPlatform = "meta" | "linkedin" | "google" | "tiktok";

export type AdCampaign = {
  id: string;
  postId: string;
  postTitle: string;
  platform: AdPlatform;
  audience: string;
  budget: number;
  durationDays: number;
  costPerResult: { low: number; high: number; unit: string };
  locked: boolean;
  status: "proposed" | "approved" | "launched" | "dismissed";
};

export type LoopProposal = {
  learnings: string[];
  nextSprintSummary: string;
  proposedChanges: string[];
};

export type MorningBrief = {
  overnight: string[];
  needsYou: string[];
  todayPosts: string[];
  sprintProgress: string;
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
  channelRecs: ChannelRecommendation[];
  connections: ChannelConnection[];
  sprint: SprintPlan;
  outreach: OutreachSequence[];
  gtm: GtmMachine;
  ads: AdCampaign[];
  loop: LoopProposal;
  brief: MorningBrief;
  onboarded: boolean;
};

export type MultiWorkspaceState = {
  activeTenantId: string;
  workspaces: Record<string, WorkspaceState>;
};

export type SignupDraft = {
  url: string;
  offer: string;
  audience: string;
  weakFit: boolean;
  workspaceName?: string;
  email?: string;
};
