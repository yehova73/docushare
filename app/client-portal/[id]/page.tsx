import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientPortal } from "./_components/client-portal";
import { ThemeProvider } from "next-themes";
import { ClientPortalHeader } from "./_components/header";
import { ClientPortalProvider } from "./_components/context/client-portal-context";
import { ConfirmationModal } from "@/components/modals/confirmation-modal/confirmation-modal";

const ClientPortalPage: React.FC<{ params: Promise<{ id: string }> }> = async ({
  params,
}) => {
  const { id } = await params;

  try {
    // Fetch the workflow/assignment with all required data
    const workflow = await prisma.templateClientAssignation.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            user: true,
            sections: {
              include: {
                fields: {
                  include: {
                    completionValue: {
                      include: {
                        files: true,
                      },
                    },
                  },
                },
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
        client: true,
      },
    });

    // If workflow not found, return 404
    if (!workflow) {
      notFound();
    }

    return (
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
        <div className="min-h-screen bg-muted/20">
          <ClientPortalProvider workflow={workflow}>
            <ClientPortalHeader
              organizationName={workflow.client.name}
              sentDate={workflow.submittedAt || new Date()}
            />
            <ClientPortal />
            <ConfirmationModal />
          </ClientPortalProvider>
        </div>
      </ThemeProvider>
    );
  } catch (error) {
    console.error("Error fetching workflow:", error);
    notFound();
  }
};

export default ClientPortalPage;
