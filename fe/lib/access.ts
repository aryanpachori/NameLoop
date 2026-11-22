/** Founder allowlist — everyone else lands on the waitlist. */
const DEFAULT_ALLOWED = ["aryanpachori03@gmail.com"];

function parseList(raw: string | undefined): string[] {
  if (!raw?.trim()) return DEFAULT_ALLOWED;
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function allowedEmails(): string[] {
  return parseList(process.env.NEXT_PUBLIC_ALLOWED_EMAILS);
}

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return allowedEmails().includes(normalized);
}
