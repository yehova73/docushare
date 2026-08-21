import { Badge } from "@/components/ui/badge";
import { FileStack } from "lucide-react";
import type { PortalBranding } from "./context/types";

export const ClientPortalHeader: React.FC<{
  organizationName: string;
  sentDate: Date;
  branding: PortalBranding;
  logoUrl?: string | null;
}> = ({ organizationName, sentDate, branding, logoUrl }) => {
  const displayName = branding.name || organizationName;

  return (
    <header
      className="z-50 border-b fixed inset-x-0 top-0"
      style={{
        backgroundColor: branding.headerFooterColor,
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2.5">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`${displayName} logo`}
              className="size-8 rounded-lg bg-background object-contain p-1 ring-1 ring-white/10"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileStack className="size-4.5" />
            </div>
          )}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground">
              Secure document portal
            </span>
          </div>
        </div>
        <Badge className="gap-1 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400">
          <span className="hidden sm:inline">
            Sent on{" "}
            {sentDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </Badge>
      </div>
    </header>
  );
};
