"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { createSeedState } from "@/lib/mock/seed";
import type {
  BusinessBrain,
  Contact,
  Owner,
  PipelineStage,
  RecordState,
  SignupDraft,
  WorkspaceState,
} from "@/lib/types";

type Action =
  | { type: "approve"; draftId: string }
  | { type: "reject"; draftId: string; reason: string }
  | { type: "updateDraft"; draftId: string; body: string; subject?: string }
  | { type: "setOwner"; accountId: string; owner: Owner; state: RecordState; reason: string; nextAction: string }
  | { type: "wrongBuyer"; accountId: string; contactId: string }
  | { type: "moveStage"; accountId: string; stage: PipelineStage }
  | { type: "togglePauseTenant" }
  | { type: "updateBrain"; brain: Partial<BusinessBrain> }
  | { type: "addSuppression"; value: string; reason: string }
  | { type: "setConnector"; id: string; status: "connected" | "error" | "disconnected" }
  | { type: "applySignup"; signup: SignupDraft };

function stamp(actor: "ai" | "human", action: string, detail: string) {
  return {
    id: `au-${Date.now()}`,
    at: new Date().toISOString(),
    actor,
    action,
    detail,
  };
}

function reducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case "approve":
      return {
        ...state,
        drafts: state.drafts.map((draft) =>
          draft.id === action.draftId
            ? { ...draft, status: "approved" as const, flaggedClaims: [] }
            : draft
        ),
        queue: state.queue.filter((item) => item.draftId !== action.draftId),
        accounts: state.accounts.map((account) => {
          const draft = state.drafts.find((item) => item.id === action.draftId);
          if (!draft || draft.accountId !== account.id) return account;
          return {
            ...account,
            state: "ai_working" as const,
            reason: "Draft approved. Waiting for you to send.",
            nextAction: "Send from Gmail or social",
          };
        }),
        audit: [
          stamp("human", "draft_approved", action.draftId),
          ...state.audit,
        ],
      };
    case "reject":
      return {
        ...state,
        drafts: state.drafts.map((draft) =>
          draft.id === action.draftId
            ? { ...draft, status: "rejected" as const, rejectReason: action.reason }
            : draft
        ),
        queue: state.queue.filter((item) => item.draftId !== action.draftId),
        audit: [
          stamp("human", "draft_rejected", `${action.draftId}: ${action.reason}`),
          ...state.audit,
        ],
      };
    case "updateDraft":
      return {
        ...state,
        drafts: state.drafts.map((draft) =>
          draft.id === action.draftId
            ? { ...draft, body: action.body, subject: action.subject ?? draft.subject }
            : draft
        ),
      };
    case "setOwner":
      return {
        ...state,
        accounts: state.accounts.map((account) =>
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
          ...state.audit,
        ],
      };
    case "wrongBuyer":
      return {
        ...state,
        contacts: state.contacts.map((contact) => {
          if (contact.accountId !== action.accountId) return contact;
          return { ...contact, isBuyer: contact.id === action.contactId };
        }),
        accounts: state.accounts.map((account) =>
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
          ...state.audit,
        ],
      };
    case "moveStage":
      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.accountId
            ? { ...account, stage: action.stage }
            : account
        ),
      };
    case "togglePauseTenant":
      return {
        ...state,
        tenant: { ...state.tenant, paused: !state.tenant.paused },
        audit: [
          stamp(
            "human",
            state.tenant.paused ? "kill_switch_off" : "kill_switch_on",
            "Tenant automation"
          ),
          ...state.audit,
        ],
      };
    case "updateBrain":
      return {
        ...state,
        brain: {
          ...state.brain,
          ...action.brain,
          version: state.brain.version + 1,
          updatedAt: new Date().toISOString(),
        },
      };
    case "addSuppression":
      return {
        ...state,
        suppressions: [
          {
            id: `sup-${Date.now()}`,
            value: action.value,
            reason: action.reason,
          },
          ...state.suppressions,
        ],
      };
    case "setConnector":
      return {
        ...state,
        connectors: state.connectors.map((connector) =>
          connector.id === action.id
            ? { ...connector, status: action.status, lastError: undefined }
            : connector
        ),
      };
    case "applySignup":
      return {
        ...state,
        onboarded: false,
        tenant: {
          ...state.tenant,
          productUrl: action.signup.url || state.tenant.productUrl,
        },
        brain: {
          ...state.brain,
          offer: {
            ...state.brain.offer,
            value: action.signup.offer || state.brain.offer.value,
            source: { label: "Signup", field: "offer" },
          },
          icp: {
            ...state.brain.icp,
            value: action.signup.audience || state.brain.icp.value,
            source: { label: "Signup", field: "icp" },
          },
        },
      };
    default:
      return state;
  }
}

type Store = {
  state: WorkspaceState;
  approveDraft: (draftId: string) => void;
  rejectDraft: (draftId: string, reason: string) => void;
  updateDraft: (draftId: string, body: string, subject?: string) => void;
  takeOver: (accountId: string, note?: string) => void;
  handBack: (accountId: string, note?: string) => void;
  pauseAccount: (accountId: string) => void;
  doNotContact: (accountId: string) => void;
  wrongBuyer: (accountId: string, contactId: string) => void;
  addContact: (contact: Contact) => void;
  moveStage: (accountId: string, stage: PipelineStage) => void;
  toggleKillSwitch: () => void;
  updateBrain: (brain: Partial<BusinessBrain>) => void;
  addSuppression: (value: string, reason: string) => void;
  reconnect: (id: string) => void;
  applySignup: (signup: SignupDraft) => void;
};

const StoreContext = createContext<Store | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createSeedState);

  const store = useMemo<Store>(
    () => ({
      state,
      approveDraft: (draftId) => dispatch({ type: "approve", draftId }),
      rejectDraft: (draftId, reason) =>
        dispatch({ type: "reject", draftId, reason }),
      updateDraft: (draftId, body, subject) =>
        dispatch({ type: "updateDraft", draftId, body, subject }),
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
        const account = state.accounts.find((item) => item.id === accountId);
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
      moveStage: (accountId, stage) =>
        dispatch({ type: "moveStage", accountId, stage }),
      toggleKillSwitch: () => dispatch({ type: "togglePauseTenant" }),
      updateBrain: (brain) => dispatch({ type: "updateBrain", brain }),
      addSuppression: (value, reason) =>
        dispatch({ type: "addSuppression", value, reason }),
      reconnect: (id) =>
        dispatch({ type: "setConnector", id, status: "connected" }),
      applySignup: (signup) => dispatch({ type: "applySignup", signup }),
    }),
    [state]
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
