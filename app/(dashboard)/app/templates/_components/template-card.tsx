"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TemplateFieldType } from "@/lib/generated/prisma/enums";
import { motion } from "framer-motion";
import {
  FileText,
  Pencil,
  Copy,
  Eye,
  UserPlus,
  Edit2,
  Trash,
  Import,
  MoreVertical,
} from "lucide-react";
import { getFieldIcon } from "../[id]/_components/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { duplicateTemplateAction } from "@/actions/templates/duplicate-template";
import { useServerAction } from "@/hooks/use-server-action";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useNewTemplateSheet } from "@/components/modals/new-template-sheet/use-new-template-sheet";
import { useTemplatePreviewDialog } from "@/components/modals/template-preview-dialog/use-template-preview-dialog";
import { deleteTemplateAction } from "@/actions/templates/delete-template";
import { requireConfirmation } from "@/components/modals/confirmation-modal/use-confirmation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TemplateCard: React.FC<{
  index: number;
  template: {
    id: string;
    category: string;
    itemCount: number;
    sectionsCount: number;
    usageCount: number;
    name: string;
    description: string;
    items: {
      id: string;
      title: string;
      type: TemplateFieldType;
    }[];
  };
  isPublicTemplate?: boolean;
}> = ({ index: i, template: t, isPublicTemplate }) => {
  const [templateData, setTemplate] = useState(t);
  const { openDialog } = useNewTemplateSheet();
  const { openDialog: openTemplatePreview } = useTemplatePreviewDialog();
  const { call: callDuplicateTemplate, loading: duplicating } = useServerAction(
    duplicateTemplateAction,
  );
  const { call: callDeleteTemplate, loading: deleting } =
    useServerAction(deleteTemplateAction);
  const router = useRouter();

  const handleDeleteTemplate = async () => {
    const confirmation = await requireConfirmation({
      title: "Delete Template",
      subtitle:
        "Are you sure you want to delete this template? This action cannot be undone.",
    }).promise;

    const res = await confirmation;
    if (!res) return;

    callDeleteTemplate(templateData.id).then((res) => {
      if (res?.id) {
        router.refresh();
      }
    });
  };
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-4.5" />
          </span>
          <div className="flex items-center gap-2">
            <Badge
              variant={"secondary"}
              // className={
              //   categoryColor[t.category] ?? "bg-muted text-foreground"
              // }
            >
              {templateData.category}
            </Badge>
            {!isPublicTemplate && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-xs">
                    <MoreVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44" align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/app/templates/${templateData.id}`} passHref>
                      <Pencil data-icon="inline-start" /> Edit template
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      openTemplatePreview({ templateId: templateData.id })
                    }
                  >
                    <Eye data-icon="inline-start" /> Preview template
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      aria-label="Duplicate template"
                      onClick={() =>
                        callDuplicateTemplate(templateData.id).then((x) => {
                          if (x?.id) {
                            router.refresh();
                          }
                        })
                      }
                      disabled={duplicating}
                    >
                      <Copy /> Duplicate template
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDeleteTemplate}
                    variant="destructive"
                  >
                    <Trash data-icon="inline-start" /> Delete template
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <CardTitle className="mt-2 flex items-center gap-2 group">
          {templateData.name}
          <Button
            size="icon-xs"
            variant={"ghost"}
            className="opacity-0 group-hover:opacity-100 transition"
            onClick={() =>
              openDialog({
                editTemplate: {
                  category: templateData.category,
                  description: templateData.description,
                  id: templateData.id,
                  name: templateData.name,
                },
                cb: (updatedTemplate) =>
                  setTemplate({
                    ...templateData,
                    category: updatedTemplate.category || "",
                    name: updatedTemplate.name,
                    description: updatedTemplate.description || "",
                  }),
              })
            }
          >
            <Edit2 />
          </Button>
        </CardTitle>
        <CardDescription>
          {templateData.sectionsCount} sections · {templateData.itemCount} items
          {!isPublicTemplate && `· used ${templateData.usageCount} times`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        {templateData.items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            {(() => {
              const Icon = getFieldIcon(item.type);
              return <Icon className="h-4 w-4" />;
            })()}
            <span className="truncate">{item.title}</span>
          </div>
        ))}
        {templateData.items.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{templateData.items.length - 3} more
          </span>
        )}
      </CardContent>
      {isPublicTemplate && (
        <CardFooter className="gap-2 mt-auto">
          <Button
            variant="secondary"
            aria-label="Preview template"
            onClick={() => openTemplatePreview({ templateId: templateData.id })}
          >
            <Eye /> Preview Template
          </Button>
          <Button
            aria-label="Duplicate template"
            className="flex-1"
            onClick={() =>
              callDuplicateTemplate(templateData.id).then((x) => {
                if (x?.id) {
                  router.refresh();
                }
              })
            }
            disabled={duplicating}
          >
            <Import /> Import template
          </Button>
        </CardFooter>
      )}
      {!isPublicTemplate && (
        <CardFooter className="mt-auto gap-2">
          <Button
            variant="secondary"
            aria-label="Preview template"
            onClick={() => openTemplatePreview({ templateId: templateData.id })}
          >
            <Eye /> Preview Template
          </Button>
          <Link
            href={`/app/new-assignation?templateId=${templateData.id}`}
            passHref
            className="flex-1"
          >
            <Button className="w-full">
              <UserPlus />
              Assign to Client
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};
