import { Badge } from "@/components/ui/badge";
import { FileStack, ShieldCheck } from "lucide-react";

export const ClientPortalHeader: React.FC<{
  organizationName: string;
  sentDate: Date;
}> = ({ organizationName, sentDate }) => {
  return (
    <header className="z-50 border-b bg-background fixed inset-x-0 top-0">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileStack className="size-4.5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              {organizationName}
            </span>
            <span className="text-xs text-muted-foreground">
              Secure document portal
            </span>
          </div>
        </div>
        <Badge className="gap-1 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400">
          {/* <ShieldCheck className="size-3" /> */}
          <span className="hidden sm:inline">
            Sent on{" "}
            {sentDate.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {/* <span className="sm:hidden">Encrypted</span> */}
        </Badge>
      </div>
    </header>
  );
};
