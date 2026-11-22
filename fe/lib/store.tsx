"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { createAllWorkspaces } from "@/lib/mock/seed";
import type {
  BusinessBrain,
  BusinessModel,
  Contact,
  MultiWorkspaceState,
  Owner,
  PipelineStage,
  RecordState,
  SenderId,
  SignupDraft,
  SprintPost,
  TrackerStage,
  WorkspaceState,
} from "@/lib/types";

type Action =
  | { type: "switchTenant"; tenantId: string }
  | { type: "approve"; draftId: string }
  | { type: "reject"; draftId: string; reason: string }
  | { type: "updateDraft"; draftId: string; body: string; subject?: string }
  | { type: "bulkApprove"; draftIds: string[] }
  | {
      type: "setOwner";
      accountId: string;
      owner: Owner;
      state: RecordState;
      reason: string;
      nextAction: string;
    }
  | { type: "wrongBuyer"; accountId: string; contactId: string }
  | { type: "moveStage"; accountId: string; stage: PipelineStage }
  | { type: "moveTracker"; accountId: string; trackerStage: TrackerStage }
  | { type: "setSenderStatus"; senderId: SenderId; status: "active" | "paused" | "warming" }
  | { type: "toggleGtmPause"; reason?: string }
  | { type: "stopLead"; accountId: string; reason: "replied" | "bounced" | "unsubscribed" }
  | { type: "togglePauseTenant" }
  | { type: "updateBrain"; brain: Partial<BusinessBrain> }
  | { type: "setBusinessModel"; model: BusinessModel }
  | { type: "selectIcps"; ids: string[] }
  | { type: "addSuppression"; value: string; reason: string }
  | { type: "setConnector"; id: string; status: "connected" | "error" | "disconnected" }
  | { type: "setConnection"; id: string; status: "connected" | "needs_reauth" | "disconnected" }
  | { type: "updateSprintPost"; postId: string; patch: Partial<SprintPost> }
  | { type: "reorderSprint"; orderedIds: string[] }
  | { type: "toggleAutopilot" }
  | { type: "setAdStatus"; id: string; status: "approved" | "launched" | "dismissed" }
  | { type: "startNextLoop" }
  | { type: "applySignup"; signup: SignupDraft }
  | { type: "completeOnboarding"; brain: Partial<BusinessBrain>; model: BusinessModel };

function stamp(actor: "ai" | "human", action: string, detail: string) {
  return {
    id: `au-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    actor,
    action,
    detail,
  };
}

function withActive(
  state: MultiWorkspaceState,
  updater: (ws: WorkspaceState) => WorkspaceState
): MultiWorkspaceState {
  const id = state.activeTenantId;
  return {
    ...state,
    workspaces: {
      ...state.workspaces,
      [id]: updater(state.workspaces[id]),
    },
  };
}

function reducer(state: MultiWorkspaceState, action: Action): MultiWorkspaceState {
  switch (action.type) {
    case "switchTenant":
      if (!state.workspaces[action.tenantId]) return state;
      return { ...state, activeTenantId: action.tenantId };
    case "approve":
      return withActive(state, (ws) => ({
        ...ws,
        drafts: ws.drafts.map((draft) =>
          draft.id === action.draftId
            ? { ...draft, status: "approved" as const, flaggedClaims: [] }
            : draft
        ),
        sprint: {
          ...ws.sprint,
          posts: ws.sprint.posts.map((post) =>
            post.id === action.draftId || post.status === "waiting_approval"
              ? post.id === action.draftId ||
                ws.drafts.find((d) => d.id === action.draftId)?.body === post.body
                ? { ...post, status: "scheduled" as const }
                : post
              : post
          ),
        },
        queue: ws.queue.filter((item) => item.draftId !== action.draftId),
        audit: [stamp("human", "draft_approved", action.draftId), ...ws.audit],
      }));
    case "bulkApprove":
      return withActive(state, (ws) => ({
        ...ws,
        drafts: ws.drafts.map((draft) =>
          action.draftIds.includes(draft.id)
            ? { ...draft, status: "approved" as const, flaggedClaims: [] }
            : draft
        ),
        sprint: {
          ...ws.sprint,
          posts: ws.sprint.posts.map((post) =>
            post.status === "waiting_approval"
              ? { ...post, status: "scheduled" as const }
              : post
          ),
        },
        queue: ws.queue.filter(
          (item) => !item.draftId || !action.draftIds.includes(item.draftId)
        ),
        audit: [stamp("human", "bulk_approve", action.draftIds.join(",")), ...ws.audit],
      }));
    case "reject":
      return withActive(state, (ws) => ({
        ...ws,
        drafts: ws.drafts.map((draft) =>
          draft.id === action.draftId
            ? { ...draft, status: "rejected" as const, rejectReason: action.reason }
            : draft
        ),
        queue: ws.queue.filter((item) => item.draftId !== action.draftId),
        audit: [
          stamp("human", "draft_rejected", `${action.draftId}: ${action.reason}`),
          ...ws.audit,
        ],
      }));
    case "updateDraft":
      return withActive(state, (ws) => ({
        ...ws,
        drafts: ws.drafts.map((draft) =>
          draft.id === action.draftId
            ? { ...draft, body: action.body, subject: action.subject ?? draft.subject }
            : draft
        ),
      }));
    case "setOwner":
      return withActive(state, (ws) => ({
        ...ws,
        accounts: ws.accounts.map((account) =>
          account.id === action.accountId
            ? {
                ...account,
                owner: action.owner,
                state: action.state,
                reason: action.reason,
                nextAction: action.nextAction,
              }
            : account
        ),
        audit: [
          stamp("human", "owner_changed", `${action.accountId} → ${action.owner}`),
          ...ws.audit,
        ],
      }));
    case "wrongBuyer":
      return withActive(state, (ws) => ({
        ...ws,
        contacts: ws.contacts.map((contact) => {
          if (contact.accountId !== action.accountId) return contact;
          return { ...contact, isBuyer: contact.id === action.contactId };
        }),
        accounts: ws.accounts.map((account) =>
          account.id === action.accountId
            ? {
                ...account,
                buyerId: action.contactId,
                reason: "Buyer replaced by founder",
                nextAction: "Rewrite outreach for the new buyer",
              }
            : account
        ),
        audit: [
          stamp("human", "wrong_buyer", `${action.accountId} → ${action.contactId}`),
          ...ws.audit,
        ],
      }));
    case "moveStage":
      return withActive(state, (ws) => ({
        ...ws,
        accounts: ws.accounts.map((account) =>
          account.id === action.accountId ? { ...account, stage: action.stage } : account
        ),
      }));
    case "moveTracker":
      return withActive(state, (ws) => ({
        ...ws,
        accounts: ws.accounts.map((account) =>
          account.id === action.accountId
            ? { ...account, trackerStage: action.trackerStage }
            : account
        ),
        audit: [
          stamp(
            "human",
            "tracker_moved",
            `${action.accountId} → ${action.trackerStage}`
          ),
          ...ws.audit,
        ],
      }));
    case "setSenderStatus":
      return withActive(state, (ws) => ({
        ...ws,
        gtm: {
          ...ws.gtm,
          senders: ws.gtm.senders.map((s) =>
            s.id === action.senderId ? { ...s, status: action.status } : s
          ),
        },
        audit: [
          stamp("human", "sender_status", `${action.senderId} → ${action.status}`),
          ...ws.audit,
        ],
      }));
    case "toggleGtmPause":
      return withActive(state, (ws) => {
        const paused = !ws.gtm.paused;
        return {
          ...ws,
          gtm: {
            ...ws.gtm,
            paused,
            pausedReason: paused
              ? action.reason ?? "Paused by founder"
              : undefined,
          },
          audit: [
            stamp("human", paused ? "gtm_paused" : "gtm_resumed", action.reason ?? ""),
            ...ws.audit,
          ],
        };
      });
    case "stopLead":
      return withActive(state, (ws) => ({
        ...ws,
        accounts: ws.accounts.map((account) =>
          account.id === action.accountId
            ? {
                ...account,
                trackerStage: action.reason,
                state:
                  action.reason === "replied" ? ("needs_human" as const) : ("paused" as const),
                owner: "human" as const,
                reason:
                  action.reason === "replied"
                    ? "Human reply — machine stopped"
                    : `Stopped: ${action.reason}`,
                nextAction:
                  action.reason === "replied"
                    ? "You own the reply. Do not auto-send."
                    : "Stay off the send queue",
              }
            : account
        ),
        audit: [
          stamp("human", "lead_stopped", `${action.accountId}: ${action.reason}`),
          ...ws.audit,
        ],
      }));
    case "togglePauseTenant":
      return withActive(state, (ws) => ({
        ...ws,
        tenant: { ...ws.tenant, paused: !ws.tenant.paused },
        audit: [
          stamp(
            "human",
            ws.tenant.paused ? "kill_switch_off" : "kill_switch_on",
            "Tenant automation"
          ),
          ...ws.audit,
        ],
      }));
    case "updateBrain":
      return withActive(state, (ws) => ({
        ...ws,
        brain: {
          ...ws.brain,
          ...action.brain,
          version: ws.brain.version + 1,
          updatedAt: new Date().toISOString(),
          history: [
            {
              version: ws.brain.version + 1,
              at: new Date().toISOString(),
              note: "Edited in Business Brain",
            },
            ...ws.brain.history,
          ],
        },
      }));
    case "setBusinessModel":
      return withActive(state, (ws) => ({
        ...ws,
        tenant: { ...ws.tenant, businessModel: action.model },
        brain: {
          ...ws.brain,
          businessModel: action.model,
          version: ws.brain.version + 1,
          updatedAt: new Date().toISOString(),
        },
      }));
    case "selectIcps":
      return withActive(state, (ws) => ({
        ...ws,
        brain: { ...ws.brain, selectedIcpIds: action.ids },
      }));
    case "addSuppression":
      return withActive(state, (ws) => ({
        ...ws,
        suppressions: [
          { id: `sup-${Date.now()}`, value: action.value, reason: action.reason },
          ...ws.suppressions,
        ],
      }));
    case "setConnector":
      return withActive(state, (ws) => ({
        ...ws,
        connectors: ws.connectors.map((connector) =>
          connector.id === action.id
            ? { ...connector, status: action.status, lastError: undefined }
            : connector
        ),
      }));
    case "setConnection":
      return withActive(state, (ws) => ({
        ...ws,
        connections: ws.connections.map((conn) =>
          conn.id === action.id ? { ...conn, status: action.status } : conn
        ),
      }));
    case "updateSprintPost":
      return withActive(state, (ws) => ({
        ...ws,
        sprint: {
          ...ws.sprint,
          posts: ws.sprint.posts.map((post) =>
            post.id === action.postId ? { ...post, ...action.patch } : post
          ),
        },
      }));
    case "reorderSprint":
      return withActive(state, (ws) => {
        const byId = Object.fromEntries(ws.sprint.posts.map((p) => [p.id, p]));
        // Keep the existing day slots; reassign them in the new order.
        const slots = ws.sprint.posts.map((p) => p.day).sort((a, b) => a - b);
        const posts = action.orderedIds
          .map((id, index) => {
            const post = byId[id];
            return post ? { ...post, day: slots[index] ?? index + 1 } : null;
          })
          .filter(Boolean) as SprintPost[];
        return { ...ws, sprint: { ...ws.sprint, posts } };
      });
    case "toggleAutopilot":
      return withActive(state, (ws) => ({
        ...ws,
        sprint: { ...ws.sprint, autopilot: !ws.sprint.autopilot },
      }));
    case "setAdStatus":
      return withActive(state, (ws) => ({
        ...ws,
        ads: ws.ads.map((ad) =>
          ad.id === action.id ? { ...ad, status: action.status, locked: false } : ad
        ),
      }));
    case "startNextLoop":
      return withActive(state, (ws) => ({
        ...ws,
        sprint: {
          ...ws.sprint,
          dayOf21: 1,
          startDate: new Date().toISOString().slice(0, 10),
          posts: ws.sprint.posts.map((post, i) => ({
            ...post,
            day: i + 1,
            status: i === 0 ? ("draft" as const) : post.status,
          })),
        },
        audit: [stamp("human", "loop_started", "Next 3-week sprint"), ...ws.audit],
      }));
    case "applySignup":
      return withActive(state, (ws) => ({
        ...ws,
        onboarded: false,
        tenant: {
          ...ws.tenant,
          name: action.signup.workspaceName || ws.tenant.name,
          productUrl: action.signup.url || ws.tenant.productUrl,
        },
        brain: {
          ...ws.brain,
          offer: {
            ...ws.brain.offer,
            value: action.signup.offer || ws.brain.offer.value,
            source: { label: "Signup", field: "offer" },
          },
          icp: {
            ...ws.brain.icp,
            value: action.signup.audience || ws.brain.icp.value,
            source: { label: "Signup", field: "icp" },
          },
        },
      }));
    case "completeOnboarding":
      return withActive(state, (ws) => ({
        ...ws,
        onboarded: true,
        tenant: { ...ws.tenant, businessModel: action.model },
        brain: {
          ...ws.brain,
          ...action.brain,
          businessModel: action.model,
          version: ws.brain.version + 1,
          updatedAt: new Date().toISOString(),
          history: [
            {
              version: ws.brain.version + 1,
              at: new Date().toISOString(),
              note: "Onboarding complete",
            },
            ...ws.brain.history,
          ],
        },
      }));
    default:
      return state;
  }
}

type Store = {
  state: WorkspaceState;
  activeTenantId: string;
  tenantList: { id: string; name: string; businessModel: BusinessModel }[];
  switchTenant: (tenantId: string) => void;
  approveDraft: (draftId: string) => void;
  rejectDraft: (draftId: string, reason: string) => void;
  updateDraft: (draftId: string, body: string, subject?: string) => void;
  bulkApprove: (draftIds: string[]) => void;
  takeOver: (accountId: string, note?: string) => void;
  handBack: (accountId: string, note?: string) => void;
  pauseAccount: (accountId: string) => void;
  doNotContact: (accountId: string) => void;
  wrongBuyer: (accountId: string, contactId: string) => void;
  addContact: (contact: Contact) => void;
  moveStage: (accountId: string, stage: PipelineStage) => void;
  moveTracker: (accountId: string, trackerStage: TrackerStage) => void;
  setSenderStatus: (senderId: SenderId, status: "active" | "paused" | "warming") => void;
  toggleGtmPause: (reason?: string) => void;
  stopLead: (accountId: string, reason: "replied" | "bounced" | "unsubscribed") => void;
  toggleKillSwitch: () => void;
  updateBrain: (brain: Partial<BusinessBrain>) => void;
  setBusinessModel: (model: BusinessModel) => void;
  selectIcps: (ids: string[]) => void;
  addSuppression: (value: string, reason: string) => void;
  reconnect: (id: string) => void;
  setConnection: (id: string, status: "connected" | "needs_reauth" | "disconnected") => void;
  updateSprintPost: (postId: string, patch: Partial<SprintPost>) => void;
  reorderSprint: (orderedIds: string[]) => void;
  toggleAutopilot: () => void;
  setAdStatus: (id: string, status: "approved" | "launched" | "dismissed") => void;
  startNextLoop: () => void;
  applySignup: (signup: SignupDraft) => void;
  completeOnboarding: (brain: Partial<BusinessBrain>, model: BusinessModel) => void;
};

const StoreContext = createContext<Store | null>(null);

function initialMulti(): MultiWorkspaceState {
  const workspaces = createAllWorkspaces();
  return { activeTenantId: "ledgerline", workspaces };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [multi, dispatch] = useReducer(reducer, undefined, initialMulti);
  const active = multi.workspaces[multi.activeTenantId];

  const store = useMemo<Store>(
    () => ({
      state: active,
      activeTenantId: multi.activeTenantId,
      tenantList: Object.values(multi.workspaces).map((ws) => ({
        id: ws.tenant.id,
        name: ws.tenant.name,
        businessModel: ws.tenant.businessModel,
      })),
      switchTenant: (tenantId) => dispatch({ type: "switchTenant", tenantId }),
      approveDraft: (draftId) => dispatch({ type: "approve", draftId }),
      rejectDraft: (draftId, reason) => dispatch({ type: "reject", draftId, reason }),
      updateDraft: (draftId, body, subject) =>
        dispatch({ type: "updateDraft", draftId, body, subject }),
      bulkApprove: (draftIds) => dispatch({ type: "bulkApprove", draftIds }),
      takeOver: (accountId) =>
        dispatch({
          type: "setOwner",
          accountId,
          owner: "human",
          state: "human_owned",
          reason: "You took over. Automation is paused.",
          nextAction: "Human owns the next touch",
        }),
      handBack: (accountId) =>
        dispatch({
          type: "setOwner",
          accountId,
          owner: "ai",
          state: "ai_working",
          reason: "Handed back with founder note",
          nextAction: "AI resumes inside the rules",
        }),
      pauseAccount: (accountId) =>
        dispatch({
          type: "setOwner",
          accountId,
          owner: "human",
          state: "paused",
          reason: "Paused by founder",
          nextAction: "Nobody acts until released",
        }),
      doNotContact: (accountId) => {
        const account = active.accounts.find((item) => item.id === accountId);
        dispatch({
          type: "setOwner",
          accountId,
          owner: "human",
          state: "paused",
          reason: "Do not contact",
          nextAction: "Stay on the suppression list",
        });
        if (account) {
          dispatch({
            type: "addSuppression",
            value: account.domain,
            reason: "Do not contact",
          });
        }
      },
      wrongBuyer: (accountId, contactId) =>
        dispatch({ type: "wrongBuyer", accountId, contactId }),
      addContact: () => undefined,
      moveStage: (accountId, stage) => dispatch({ type: "moveStage", accountId, stage }),
      moveTracker: (accountId, trackerStage) =>
        dispatch({ type: "moveTracker", accountId, trackerStage }),
      setSenderStatus: (senderId, status) =>
        dispatch({ type: "setSenderStatus", senderId, status }),
      toggleGtmPause: (reason) => dispatch({ type: "toggleGtmPause", reason }),
      stopLead: (accountId, reason) => dispatch({ type: "stopLead", accountId, reason }),
      toggleKillSwitch: () => dispatch({ type: "togglePauseTenant" }),
      updateBrain: (brain) => dispatch({ type: "updateBrain", brain }),
      setBusinessModel: (model) => dispatch({ type: "setBusinessModel", model }),
      selectIcps: (ids) => dispatch({ type: "selectIcps", ids }),
      addSuppression: (value, reason) => dispatch({ type: "addSuppression", value, reason }),
      reconnect: (id) => dispatch({ type: "setConnector", id, status: "connected" }),
      setConnection: (id, status) => dispatch({ type: "setConnection", id, status }),
      updateSprintPost: (postId, patch) =>
        dispatch({ type: "updateSprintPost", postId, patch }),
      reorderSprint: (orderedIds) => dispatch({ type: "reorderSprint", orderedIds }),
      toggleAutopilot: () => dispatch({ type: "toggleAutopilot" }),
      setAdStatus: (id, status) => dispatch({ type: "setAdStatus", id, status }),
      startNextLoop: () => dispatch({ type: "startNextLoop" }),
      applySignup: (signup) => dispatch({ type: "applySignup", signup }),
      completeOnboarding: (brain, model) =>
        dispatch({ type: "completeOnboarding", brain, model }),
    }),
    [active, multi.activeTenantId, multi.workspaces]
  );

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useWorkspace() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return value;
}

export function useAccount(id: string) {
  const { state } = useWorkspace();
  const account = state.accounts.find((item) => item.id === id);
  const contacts = state.contacts.filter((item) => item.accountId === id);
  const buyer = contacts.find((item) => item.id === account?.buyerId);
  const signals = state.signals.filter((item) => item.accountId === id);
  const touches = state.touches.filter((item) => item.accountId === id);
  const drafts = state.drafts.filter((item) => item.accountId === id);
  const discovery = state.discoveries.find((item) => item.accountId === id);
  const meeting = state.meetings.find((item) => item.accountId === id);
  return { account, contacts, buyer, signals, touches, drafts, discovery, meeting };
}
