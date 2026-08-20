"use client";

import React from "react";
import { useEditTemplate } from "./context/edit-template-context";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function SaveStatus() {
  const { isSaving, lastSaved, isDirty } = useEditTemplate();

  if (isSaving) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Loader2 className="w-3 h-3 animate-spin" />
        Saving...
      </Badge>
    );
  }

  if (isDirty) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <div className="w-2 h-2 bg-current rounded-full" />
        Unsaved changes
      </Badge>
    );
  }

  if (lastSaved) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
      </Badge>
    );
  }

  return null;
}
