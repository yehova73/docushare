"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { Client } from "@/lib/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";

export const getClientsAction = async (): Promise<
  ServerActionResponse<{ clients: Client[] }>
> => {
  const user = await getUserFromSession();

  const clients = await prisma.client.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    status: "ok",
    data: {
      clients,
    },
  };
};
