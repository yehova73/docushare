"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { Client } from "@/lib/generated/prisma/browser";
import { getUserFromSession } from "../account/account";
import { prisma } from "@/lib/prisma";

export const deleteClientAction = async (
  id: string,
): Promise<ServerActionResponse<{ id: string }>> => {
  try {
    const user = await getUserFromSession();

    await prisma.templateClientAssignation.deleteMany({
      where: {
        clientId: id,
      },
    });
    const deletedClient = await prisma.client.delete({
      where: {
        id,
        userId: user?.id || "",
      },
    });

    return {
      status: "ok",
      data: { id: deletedClient.id },
      message: {
        title: "Client deleted",
        description: `"${deletedClient.name}" has been deleted successfully`,
      },
    };
  } catch (error) {
    return {
      status: "error",
      message: {
        title: "Error deleting client",
        description:
          "An error occurred while deleting the client. Please try again.",
      },
    };
  }
};
