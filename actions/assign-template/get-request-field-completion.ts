"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";

export interface RequestFieldCompletionField {
  id: string;
  name: string;
  required: boolean;
  completed: boolean;
}

export interface RequestFieldCompletionSection {
  id: string;
  name: string;
  completedFields: number;
  totalFields: number;
  fields: RequestFieldCompletionField[];
}

export interface RequestFieldCompletionData {
  requestName: string;
  clientName: string;
  templateName: string;
  completedFields: number;
  totalFields: number;
  sections: RequestFieldCompletionSection[];
}

export const getRequestFieldCompletionAction = async (
  assignationId: string,
): Promise<ServerActionResponse<RequestFieldCompletionData>> => {
  const user = await getUserFromSession();

  const assignation = await prisma.templateClientAssignation.findFirst({
    where: {
      id: assignationId,
      template: { userId: user.id },
    },
    include: {
      client: true,
      template: {
        include: {
          sections: {
            include: {
              fields: {
                include: {
                  completionValue: {
                    include: { files: true },
                  },
                },
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!assignation) {
    return {
      status: "error",
      message: {
        title: "Request not found",
        description:
          "The request does not exist or you do not have access to it.",
      },
      data: null,
    };
  }

  const sections: RequestFieldCompletionSection[] =
    assignation.template.sections.map((section) => {
      const fields: RequestFieldCompletionField[] = section.fields.map(
        (field) => {
          const value = field.completionValue;
          const completed =
            !!value && (value.value !== null || value.files.length > 0);

          return {
            id: field.id,
            name: field.name,
            required: field.required,
            completed,
          };
        },
      );

      return {
        id: section.id,
        name: section.name,
        completedFields: fields.filter((field) => field.completed).length,
        totalFields: fields.length,
        fields,
      };
    });

  return {
    status: "ok",
    data: {
      requestName: assignation.name || assignation.template.name,
      clientName: assignation.client.name,
      templateName: assignation.template.name,
      completedFields: assignation.completedFieldsCount,
      totalFields: assignation.totalFieldsCount,
      sections,
    },
  };
};
