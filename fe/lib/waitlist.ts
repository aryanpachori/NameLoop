export const WAITLIST_KEY = "nameloop.waitlist";

export type WaitlistSpot = {
  email: string;
  url?: string;
  audience?: string;
  joinedAt: string;
};

export function readWaitlistSpot(): WaitlistSpot | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(WAITLIST_KEY);
  if (!raw) return null;
  try {
    const spot = JSON.parse(raw) as WaitlistSpot;
    if (!spot.email) return null;
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

  const spot: WaitlistSpot = {
    email: input.email.trim().toLowerCase(),
    joinedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(spot));
  return spot;
}
