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
          className="inline-flex items-center gap-2.5 text-[13px] font-medium tracking-tight text-muted-foreground"
        >
          <ChannelMark id={id} className="text-foreground" />
          {channelLabel(id)}
          <span aria-hidden className="mx-1 text-border">
            ·
          </span>
        </span>
      ))}
    </>
  );
}

/** Full-bleed channel signal strip — keeps scroll energy after the hero field. */
export function ChannelMarquee() {
  return (
    <div className="border-y border-border bg-background py-4" aria-hidden="true">
      <div className="marquee">
        <div className="marquee__track px-4">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
