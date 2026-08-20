import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, PartyPopper, ShieldCheck } from "lucide-react";
import { useClientPortalContext } from "./context/client-portal-context";

export function SuccessView() {
  const { sections, workflow } = useClientPortalContext();
  // Flatten and filter items that are done
  const allItems = sections.flatMap((s) => s.items);
  const uploaded = allItems.filter((i) => i.status === "done");
  const clientName = workflow.client?.name ?? "Valued Client";
  const organizationName = workflow.template?.user?.name ?? "Organization";

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 pt-8 text-center"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
        className="flex size-16 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-500"
      >
        <PartyPopper className="size-8" />
      </motion.span>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Thank you, {clientName}!
        </h1>
        <p className="max-w-sm text-pretty text-muted-foreground">
          Your documents have been securely uploaded directly to{" "}
          {organizationName}&apos;s storage. No further action is needed.
        </p>
      </div>

      <Card className="w-full text-left">
        <CardContent className="flex flex-col gap-3">
          <span className="text-sm font-medium">Upload receipt</span>
          <div className="flex flex-col gap-2">
            {uploaded.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <FileText className="size-4 text-muted-foreground" />
                  {i.completionValue?.files?.[0].fileName ?? i.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  Received
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        End-to-end direct upload · Powered by DocFetch
      </p>
    </motion.div>
  );
}
