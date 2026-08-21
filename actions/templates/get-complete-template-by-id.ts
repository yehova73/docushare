"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { getUserFromSession } from "../account/account";
import { TemplateGetPayload } from "@/lib/generated/prisma/internal/prismaNamespaceBrowser";
import { prisma } from "@/lib/prisma";

export const getCompleteTemplateByIdAction = async (
  id: string,
): Promise<
  ServerActionResponse<
    TemplateGetPayload<{
      include: {
        sections: {
          include: {
            name: true;
            fields: true;
          };
        };
      };
    }>
  >
> => {
  const user = await getUserFromSession();

  const template = await prisma.template.findUnique({
    where: {
      id,
    },
    include: {
      sections: {
        include: {
          fields: true,
        },
      },
    },
  });

  if (!template || (template.userId && template.userId !== user?.id)) {
    return {
      status: "error",
      message: {
        title: "Template not found",
        description:
          "The requested template does not exist or you do not have access to it.",
      },
      data: null,
    };
  }

  return {
    status: "ok",
    data: template,
  };
};
