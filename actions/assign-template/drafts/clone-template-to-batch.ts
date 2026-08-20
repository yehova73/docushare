"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../../account/account";
import { duplicateTemplateAction } from "../../templates/duplicate-template";

export type CloneTemplateToBatchInput = {
  templateId: string;
  batchId: string;
};

export const cloneTemplateToBatchAction = async (
  input: CloneTemplateToBatchInput,
): Promise<
  ServerActionResponse<{
    templateId: string;
    batchId: string;
  }>
> => {
  try {
    const user = await getUserFromSession();

    const batch = await prisma.templateAssignationBatch.findFirst({
      where: { id: input.batchId, userId: user?.id },
      select: { id: true, templateId: true },
    });

    if (!batch) {
      return {
        status: "error",
        message: {
          title: "Draft not found",
          description: "The assignation draft does not exist or was removed.",
        },
        data: null,
      };
    }

    // If the batch already holds a copy of the selected template, reuse it
    // instead of cloning again. This covers both the case where the selected
    // template IS the batch's copy and the case where a copy of the selected
    // template already exists for this batch.
    if (batch.templateId) {
      const boundTemplate = await prisma.template.findFirst({
        where: { id: batch.templateId, userId: user?.id },
        select: { id: true, assignationParentTemplateId: true },
      });

      if (
        boundTemplate &&
        boundTemplate.assignationParentTemplateId &&
        (boundTemplate.id === input.templateId ||
          boundTemplate.assignationParentTemplateId === input.templateId)
      ) {
        return {
          status: "ok",
          data: {
            templateId: boundTemplate.id,
            batchId: batch.id,
          },
        };
      }
    }

    // Clone the template so the batch gets its own editable copy.
    const duplicated = await duplicateTemplateAction(input.templateId);
    if (duplicated.status === "error" || !duplicated.data) {
      return {
        status: "error",
        message: {
          title: "Failed to clone template",
          description:
            duplicated.message?.description ||
            "An error occurred while cloning the template.",
        },
        data: null,
      };
    }

    // Bind the freshly cloned template to the batch and record the source
    // template so future edit clicks can detect this copy and avoid recloning.
    await prisma.template.update({
      where: { id: duplicated.data.id },
      data: { assignationParentTemplateId: input.templateId },
    });
    await prisma.templateAssignationBatch.update({
      where: { id: batch.id },
      data: { templateId: duplicated.data.id },
    });

    return {
      status: "ok",
      data: {
        templateId: duplicated.data.id,
        batchId: batch.id,
      },
    };
  } catch (error) {
    console.error("Failed to clone template to batch:", error);
    return {
      status: "error",
      message: {
        title: "Failed to clone template",
        description:
          "An error occurred while cloning the template to the draft.",
      },
      data: null,
    };
  }
};
