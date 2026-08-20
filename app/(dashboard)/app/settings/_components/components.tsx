export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </h2>
  );
}

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      {children}
    </div>
  );
}

export function Divider() {
  return (
    <div className="border-t" style={{ borderColor: "var(--color-border)" }} />
  );
}
export function SettingRow({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {desc && (
          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
