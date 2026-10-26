export const WAITLIST_KEY = "nameloop.waitlist";
export const WAITLIST_COUNT_KEY = "nameloop.waitlist.count";
export const BASE_AHEAD = 184;

export type WaitlistSpot = {
  email: string;
  url?: string;
  audience?: string;
  position: number;
  joinedAt: string;
};

function readCount(): number {
  if (typeof window === "undefined") return BASE_AHEAD;
  const raw = window.localStorage.getItem(WAITLIST_COUNT_KEY);
  const parsed = raw ? Number(raw) : BASE_AHEAD;
  return Number.isFinite(parsed) && parsed >= BASE_AHEAD ? parsed : BASE_AHEAD;
}

export function readWaitlistSpot(): WaitlistSpot | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(WAITLIST_KEY);
  if (!raw) return null;
  try {
    const spot = JSON.parse(raw) as WaitlistSpot;
    if (!spot.email || !spot.position) return null;
    return spot;
  } catch {
    return null;
  }
}

export function joinWaitlist(input: { email: string }): WaitlistSpot {
  const existing = readWaitlistSpot();
  if (existing && existing.email.toLowerCase() === input.email.toLowerCase()) {
    return existing;
  }

  const count = readCount() + 1;
  const spot: WaitlistSpot = {
    email: input.email.trim(),
    position: count,
    joinedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(WAITLIST_COUNT_KEY, String(count));
  window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(spot));
  return spot;
}
