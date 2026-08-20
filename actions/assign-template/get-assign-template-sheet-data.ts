"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { getUserFromSession } from "../account/account";
import { prisma } from "@/lib/prisma";
import { Client, Template } from "@/lib/generated/prisma/browser";

export const getAssignTemplateSheetDataAction = async (): Promise<
  ServerActionResponse<{
    clients: Client[];
    templates: Template[];
  }>
> => {
  const user = await getUserFromSession();

  const clients = await prisma.client.findMany({
    where: {
      userId: user?.id,
    },
  });

  const templates = await prisma.template.findMany({
    where: {
      userId: user?.id,
      templateClientAssignation: null,
    },
  });

  console.log(templates);
  return {
    status: "ok",
    data: {
      clients,
      templates,
    },
  };
};
