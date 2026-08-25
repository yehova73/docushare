import { Badge } from "@/components/ui/badge";
import { AssignedTemplateStatus } from "@/lib/generated/prisma/enums";
import { cn, capitalize } from "@/lib/utils";
import { CircleDot, Clock, CheckCircle2 } from "lucide-react";

const config: Record<
  AssignedTemplateStatus,
  { className: string; icon: typeof CircleDot }
> = {
  OVERDUE: {
    className: "bg-destructive/12 text-destructive dark:bg-destructive/15",
    icon: CircleDot,
  },
  COMPLETED: {
    className: "bg-success/12 text-success",
    icon: CheckCircle2,
  },
  ASSIGNED: {
    className:
      "bg-amber-500/12 text-amber-700 dark:text-amber-400 dark:bg-amber-400/12",
    icon: CircleDot,
  },
  DRAFT: {
    className: "bg-secondary text-secondary-foreground",
    icon: CircleDot,
  },
  IN_PROGRESS: {
    className:
      "bg-amber-500/12 text-amber-700 dark:text-amber-400 dark:bg-amber-400/12",
    icon: CircleDot,
  },
};

export function StatusBadge({ status }: { status: AssignedTemplateStatus }) {
  const { className, icon: Icon } = config[status];

  return (
    <Badge className={cn("gap-1 font-medium", className)}>
      <Icon className="size-3" />
      {capitalize(status.replace("_", " ").toLowerCase())}
    </Badge>
  );
}
