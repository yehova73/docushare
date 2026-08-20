export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
