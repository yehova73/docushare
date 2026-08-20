"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { Client } from "@/lib/generated/prisma/browser";
import { getUserFromSession } from "../account/account";
import { prisma } from "@/lib/prisma";

export const editClientAction = async (data: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}): Promise<ServerActionResponse<Client>> => {
  try {
    const user = await getUserFromSession();

    const editClient = await prisma.client.update({
      where: {
        id: data.id,
        userId: user?.id || "",
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        userId: user?.id || "",
      },
    });
    return {
      status: "ok",
      data: editClient,
      message: {
        title: "Client updated",
        description: `"${editClient.name}" has been updated successfully`,
      },
    };
  } catch (error) {
    return {
      status: "error",
      message: {
        title: "Error updating client",
        description:
          "An error occurred while updating the client. Please try again.",
      },
    };
  }
};
