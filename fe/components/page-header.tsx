export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-[15px] text-clay">{eyebrow}</p>
        ) : null}
        <h1 className="heading-page">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-[15px] text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-4">{actions}</div> : null}
    </div>
  );
}
