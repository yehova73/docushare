"use server";

import { getUserFromSession } from "@/actions/account/account";
import { prisma } from "@/lib/prisma";

export async function exportAccountDataAction(): Promise<{
  exportedAt: string;
  clients: object[];
  templates: object[];
  requests: object[];
}> {
  const user = await getUserFromSession();

  const [clients, templates, requests] = await Promise.all([
    prisma.client.findMany({
      where: { userId: user.id },
      select: { name: true, email: true, company: true, createdAt: true },
    }),
    prisma.template.findMany({
      where: { userId: user.id },
      select: {
        name: true,
        description: true,
        category: true,
        totalFields: true,
        createdAt: true,
        sections: {
          select: {
            name: true,
            fields: { select: { title: true, type: true, required: true } },
          },
        },
      },
    }),
    prisma.templateClientAssignation.findMany({
      where: { template: { userId: user.id } },
      select: {
        name: true,
        status: true,
        dueDate: true,
        completedFieldsCount: true,
        totalFieldsCount: true,
        createdAt: true,
        client: { select: { name: true, email: true } },
        template: { select: { name: true } },
      },
    }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    clients,
    templates,
    requests,
  };
}
