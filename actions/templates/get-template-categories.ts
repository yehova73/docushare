"use server";

import { ServerActionResponse } from "@/hooks/use-server-action";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";

export const getTemplateCategoriesAction = async (): Promise<
  ServerActionResponse<string[]>
> => {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return {
        status: "error",
        message: {
          title: "Unauthorized",
          description: "Please sign in to view categories",
        },
        data: null,
      };
    }

    const templates = await prisma.template.findMany({
      where: {
        userId: user.id,
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    const categories = templates
      .map((t) => t.category)
      .filter((cat): cat is string => cat !== null && cat !== undefined);

    return {
      status: "ok",
      data: categories,
    };
  } catch (error) {
    console.error("Failed to fetch template categories:", error);
    return {
      status: "error",
      message: {
        title: "Failed to fetch categories",
        description: "An error occurred while fetching template categories",
      },
      data: null,
    };
  }
};
