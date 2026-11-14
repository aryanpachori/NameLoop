import type { ChannelId } from "@/lib/types";
import { cn } from "@/lib/utils";

const LABELS: Record<ChannelId, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  reddit: "Reddit",
  whatsapp: "WhatsApp",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
};

function Icon({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
      className="shrink-0"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

const glyphs: Record<ChannelId, React.ReactNode> = {
  email: (
    <Icon title="Email">
      <path
        fill="currentColor"
        d="M1.5 3.5A1.5 1.5 0 0 1 3 2h10a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 13 14H3A1.5 1.5 0 0 1 1.5 12.5v-9Zm1.2.4 5.05 3.7a.5.5 0 0 0 .5 0l5.05-3.7a.4.4 0 0 0-.3-.7H3a.4.4 0 0 0-.3.7Z"
      />
    </Icon>
  ),
  linkedin: (
    <Icon title="LinkedIn">
      <path
        fill="currentColor"
        d="M2.5 2A1.5 1.5 0 0 0 1 3.5v9A1.5 1.5 0 0 0 2.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 11.5 2h-9ZM4 5.2a1.1 1.1 0 1 1 0 2.2A1.1 1.1 0 0 1 4 5.2Zm-.9 3.1h1.8V12H3.1V8.3ZM6.4 8.3H8v.5c.2-.4.9-.7 1.6-.7 1.4 0 2 1 2 2.4V12H9.8v-1.8c0-.8-.2-1.4-.9-1.4-.8 0-1.1.6-1.1 1.4V12H6.4V8.3Z"
      />
    </Icon>
  ),
  x: (
    <Icon title="X">
      <path
        fill="currentColor"
        d="M12.6.77h2.45l-5.36 6.13L16 15.23h-4.94l-3.87-5.06-4.42 5.06H.32l5.73-6.55L0 .77h5.06l3.5 4.63L12.6.77Zm-.77 11.68h1.36L4.32 2.08H3.41l8.42 10.37Z"
      />
    </Icon>
  ),
  instagram: (
    <Icon title="Instagram">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 1.5h6A3.5 3.5 0 0 1 14.5 5v6a3.5 3.5 0 0 1-3.5 3.5H5A3.5 3.5 0 0 1 1.5 11V5A3.5 3.5 0 0 1 5 1.5Zm0 1.2A2.3 2.3 0 0 0 2.7 5v6A2.3 2.3 0 0 0 5 13.3h6A2.3 2.3 0 0 0 13.3 11V5A2.3 2.3 0 0 0 11 2.7H5Zm7.1 1.2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6ZM8 4.7a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm0 1.3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
        clipRule="evenodd"
      />
    </Icon>
  ),
  facebook: (
    <Icon title="Facebook">
      <path
        fill="currentColor"
        d="M9.2 14V8.7h1.8l.3-2.1H9.2V5.3c0-.6.2-1 1-1h1.1V2.4S10.3 2.2 9.3 2.2c-2 0-3.3 1.2-3.3 3.4v1H4.3v2.1h1.7V14h3.2Z"
      />
    </Icon>
  ),
  tiktok: (
    <Icon title="TikTok">
      <path
        fill="currentColor"
        d="M10.2 2.2c.4 1.5 1.5 2.7 3 3.1v2.1a5.1 5.1 0 0 1-3-.9v3.7a4.1 4.1 0 1 1-4.1-4.1c.2 0 .5 0 .7.1v2.1a2 2 0 1 0 1.4 1.9V2.2h2Z"
      />
    </Icon>
  ),
  youtube: (
    <Icon title="YouTube">
      <path
        fill="currentColor"
        d="M14.3 5.2a1.8 1.8 0 0 0-1.3-1.3C11.8 3.6 8 3.6 8 3.6s-3.8 0-5 .3A1.8 1.8 0 0 0 1.7 5.2 18.8 18.8 0 0 0 1.4 8a18.8 18.8 0 0 0 .3 2.8 1.8 1.8 0 0 0 1.3 1.3c1.2.3 5 .3 5 .3s3.8 0 5-.3a1.8 1.8 0 0 0 1.3-1.3A18.8 18.8 0 0 0 14.6 8a18.8 18.8 0 0 0-.3-2.8ZM6.8 10.3V5.7L10.6 8l-3.8 2.3Z"
      />
    </Icon>
  ),
  reddit: (
    <Icon title="Reddit">
      <path
        fill="currentColor"
        d="M12.7 7.1a1.3 1.3 0 0 0-2.2-.9 6.8 6.8 0 0 0-3.3-.9l.6-1.8 1.6.4a1 1 0 1 0 .1-1.1L7.6 2.4a.6.6 0 0 0-.7.4L6 5.3a6.8 6.8 0 0 0-3.4.9 1.3 1.3 0 1 0-1.5 2c0 .2-.1.4-.1.6 0 2.1 2.5 3.8 5.5 3.8s5.5-1.7 5.5-3.8c0-.2 0-.4-.1-.6a1.3 1.3 0 0 0 .8-1.1ZM6.2 9.3a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm4.5-.3c-.3.5-1.1.9-2.2.9s-1.9-.4-2.2-.9a.4.4 0 1 1 .7-.4c.1.2.6.5 1.5.5s1.4-.3 1.5-.5a.4.4 0 1 1 .7.4Zm-.8-1.5a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
      />
    </Icon>
  ),
  whatsapp: (
    <Icon title="WhatsApp">
      <path
        fill="currentColor"
        d="M8 1.6A6.4 6.4 0 0 0 2.3 11l-.7 2.6 2.7-.7A6.4 6.4 0 1 0 8 1.6Zm3.3 9.1c-.1.4-.8.7-1.1.8-.3 0-.6.1-1.9-.4-1.7-.7-2.8-2.5-2.9-2.6-.1-.2-.8-1.1-.8-2s.5-1.4.7-1.6c.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2 0 .3 0 .4l-.3.4c-.1.1-.2.3-.1.4.1.2.5.8 1.1 1.3.7.6 1.3.8 1.5.9.2.1.3.1.4 0l.5-.6c.1-.1.3-.1.4-.1l1.3.6c.2.1.3.1.3.2 0 .4-.1 1.1-.4 1.4Z"
      />
    </Icon>
  ),
  google_ads: (
    <Icon title="Google Ads">
      <path
        fill="currentColor"
        d="M9.4 3.2 4.1 12.2A2 2 0 0 1 2.4 13a2 2 0 0 1-1.7-3L5.9 1.9a2 2 0 0 1 3.5 1.3Zm4.3 1.5a2 2 0 0 0-1.7-1 2 2 0 0 0-1.7 1L6.2 12a2 2 0 1 0 3.5 1.1l4-7.4ZM4.5 13.5a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"
      />
    </Icon>
  ),
  meta_ads: (
    <Icon title="Meta Ads">
      <path
        fill="currentColor"
        d="M9.3 4.2c-.8 0-1.5.6-2.1 1.5-.6-.9-1.3-1.5-2.1-1.5C3.5 4.2 2 6.4 2 9.1c0 2.2 1 3.7 2.4 3.7.8 0 1.4-.4 2.1-1.4.3-.5.6-1.1.8-1.7.2.6.5 1.2.8 1.7.7 1 1.3 1.4 2.1 1.4 1.4 0 2.4-1.5 2.4-3.7 0-2.7-1.5-4.9-3.3-4.9Zm-3.4 5.7c-.4 1-1 1.7-1.4 1.7-.7 0-1.2-1-1.2-2.5 0-1.9.9-3.4 1.8-3.4.4 0 .9.4 1.4 1.3l-.6 2.9Zm4.8 1.7c-.4 0-1-.7-1.4-1.7l-.6-2.9c.5-.9 1-1.3 1.4-1.3.9 0 1.8 1.5 1.8 3.4 0 1.5-.5 2.5-1.2 2.5Z"
      />
    </Icon>
  ),
};

export function channelLabel(id: ChannelId) {
  return LABELS[id];
}

export function ChannelMark({
  id,
  className,
}: {
  id: ChannelId;
  className?: string;
}) {
  return <span className={cn("inline-flex text-foreground", className)}>{glyphs[id]}</span>;
}

export function ChannelChip({
  id,
  className,
}: {
  id: ChannelId;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-[8px] border border-border bg-card px-2 text-13 text-foreground",
        className
      )}
    >
      <ChannelMark id={id} />
      {LABELS[id]}
    </span>
  );
}

export const CHANNEL_IDS = Object.keys(LABELS) as ChannelId[];
