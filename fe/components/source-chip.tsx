import { Badge } from "@/components/ui/badge";
import type { SourceRef } from "@/lib/types";

export function SourceChip({ source }: { source: SourceRef }) {
  const label = source.field ? `${source.label} · ${source.field}` : source.label;
  if (source.href) {
    return (
      <Badge variant="outline" render={<a href={source.href} target="_blank" rel="noreferrer" />}>
        {label}
      </Badge>
    );
  }
  return <Badge variant="outline">{label}</Badge>;
}
