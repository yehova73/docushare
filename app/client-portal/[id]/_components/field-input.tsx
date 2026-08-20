"use client";

import { saveFieldValueAction } from "@/actions/save-field-value";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useServerAction } from "@/hooks/use-server-action";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Edit, Loader2, Minimize2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldInputVariants } from "./upload-cards/field-input-variants";
import { useClientPortalContext } from "./context/client-portal-context";
import { PortalItem } from "./context/types";
import { isTextField } from "./context/utils";

export function FieldInput({
  item,
  assignationId,
}: {
  item: PortalItem;
  assignationId: string;
}) {
  const { setText } = useClientPortalContext();
  const isDone = !isTextField(item) ? item.status === "done" : !!item.value;

  const [expanded, setExpanded] = useState(!isDone);
  const [localValue, setLocalValue] = useState<string | null>(
    item.value ?? null,
  );
  const { call: saveValue, loading: isSaving } =
    useServerAction(saveFieldValueAction);

  useEffect(() => {
    setLocalValue(item.value ?? null);
  }, [item.value]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  const handleSave = async () => {
    if (isTextField(item)) {
      await saveValue(item.id, assignationId, localValue).then((savedValue) => {
        if (savedValue !== null) {
          if (!item.value && savedValue?.value) {
            setExpanded(false);
          }
          setText(item.id, savedValue?.value ?? "");
        }
      });
    }
  };

  const handleClear = async () => {
    setLocalValue(null);
    setText(item.id, "");
    await saveValue(item.id, assignationId, null).then((savedValue) => {
      if (savedValue !== null) {
        setText(item.id, "");
      }
    });
  };

  const isModified = localValue !== item.value;

  return (
    <Card className={cn("transition-colors", isDone && "ring-emerald-500/30")}>
      <CardContent className="flex flex-col gap-3 px-0">
        <div className="flex items-start justify-between gap-3 px-3">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{item.name}</span>
              {item.required ? (
                <Badge>Required</Badge>
              ) : (
                <Badge variant="secondary">Optional</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          {isDone && (
            <div className="flex items-center gap-2">
              <Button
                size="icon-sm"
                variant={"ghost"}
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? (
                  <Minimize2 className="opacity-80" />
                ) : (
                  <Edit className="opacity-80 " />
                )}
              </Button>
              <CheckCircle2 className="text-emerald-500" />
            </div>
          )}
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="accordion-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden "
            >
              <div className="px-3 mb-4 mt-1">
                <FieldInputVariants
                  handleTextChange={handleTextChange}
                  item={item}
                  localValue={localValue}
                />
              </div>

              {isTextField(item) && (
                <CardFooter className="flex justify-end space-x-2 py-2">
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={handleClear}
                    disabled={isSaving || !localValue}
                  >
                    <X className="size-4" />
                    Clear
                  </Button>
                  <Button
                    size={"sm"}
                    onClick={handleSave}
                    disabled={isSaving || !isModified}
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
