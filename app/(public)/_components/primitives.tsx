export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-bold leading-[1.1] text-foreground sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function BrowserFrame({
  url = "app.docfetch.com",
  className = "",
  children,
}: {
  url?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-float ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto hidden max-w-xs flex-1 rounded-md border border-border bg-card px-3 py-1 text-center font-mono text-[11px] text-muted-foreground sm:block">
          {url}
        </div>
        <div className="hidden w-12 sm:block" />
      </div>
      <div className="bg-card">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-[268px] rounded-[2.25rem] border border-border bg-card p-2 shadow-float">
      <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background">
        <div className="flex justify-center bg-card py-2">
          <span className="h-1.5 w-16 rounded-full bg-border" />
        </div>
        {children}
      </div>
    </div>
  );
}
