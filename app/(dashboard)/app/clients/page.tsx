import { getUserFromSession } from "@/actions/account/account";
import { prisma } from "@/lib/prisma";
import { ClientsTable } from "./_components/clients-table";

const ClientsPage = async () => {
  const user = await getUserFromSession();

  const clients = await prisma.client.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      templateClientAssignations: {
        include: {
          template: {
            select: {
              totalFields: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return <ClientsTable initialClients={clients} />;
};

export default ClientsPage;
