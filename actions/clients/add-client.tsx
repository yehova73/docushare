"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { Client } from "@/lib/generated/prisma/browser";
import { getUserFromSession } from "../account/account";
import { prisma } from "@/lib/prisma";

export const addClientAction = async (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}): Promise<ServerActionResponse<Client>> => {
  try {
    const user = await getUserFromSession();

    const newClient = await prisma.client.create({
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
      data: newClient,
      message: {
        title: "Client added",
        description: `"${newClient.name}" has been added successfully`,
      },
    };
  } catch (error) {
    return {
      status: "error",
      message: {
        title: "Error adding client",
        description:
          "An error occurred while adding the client. Please try again.",
      },
    };
  }
};
