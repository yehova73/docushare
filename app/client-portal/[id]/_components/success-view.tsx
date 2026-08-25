import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, PartyPopper, ShieldCheck } from "lucide-react";
import { useClientPortalContext } from "./context/client-portal-context";
import { formatPortalMessage, isTextField } from "./context/utils";

export function SuccessView() {
  const { sections, workflow, branding } = useClientPortalContext();
  const allItems = sections.flatMap((s) => s.items);
  const submitted = allItems.filter(
    (i) => i.status === "done" || (isTextField(i) && i.value),
  );
  const clientName = workflow.client?.name ?? "Valued Client";
  const organizationName = workflow.template?.user?.name ?? "Organization";

  const submittedText = formatPortalMessage(branding.submittedMessage, {
    clientName,
    userName: organizationName,
  });

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
        className="flex size-16 items-center justify-center rounded-full bg-success/12 text-success"
      >
        <PartyPopper className="size-8" />
      </motion.span>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Thank you, {clientName}!
        </h1>
        <p className="max-w-sm text-pretty text-muted-foreground">
          {submittedText}
        </p>
      </div>

      <Card className="w-full text-left">
        <CardContent className="flex flex-col gap-3">
          <span className="text-sm font-medium">Submission receipt</span>
          <div className="flex flex-col gap-2">
            {submitted.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex items-center gap-2 text-foreground">
                  <FileText className="size-4 text-muted-foreground" />
                  {i.completionValue?.files?.[0].fileName ?? i.value ?? i.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-success">
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
