import { ChannelMark, channelLabel } from "@/components/channel-mark";
import type { ChannelId } from "@/lib/types";

const CHANNELS: ChannelId[] = [
  "email",
  "linkedin",
  "x",
  "instagram",
  "youtube",
  "reddit",
  "tiktok",
  "whatsapp",
  "facebook",
  "google_ads",
  "meta_ads",
];

function Row() {
  return (
    <>
      {CHANNELS.map((id) => (
        <span
          key={id}
          className="inline-flex items-center gap-2.5 whitespace-nowrap text-13 font-medium tracking-tight text-muted-foreground"
        >
          <ChannelMark id={id} className="text-foreground" />
          {channelLabel(id)}
          <span aria-hidden className="text-border">
            /
          </span>
        </span>
      ))}
    </>
  );
}

export function ChannelMarquee() {
  return (
    <div className="border-y border-border bg-card/40 py-3.5">
      <p className="sr-only">
        Works across email, LinkedIn, X, Instagram, YouTube, Reddit, TikTok, WhatsApp, Facebook, Google Ads, and Meta Ads.
      </p>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track gap-8 px-4">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
