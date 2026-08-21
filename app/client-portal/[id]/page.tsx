import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientPortal } from "./_components/client-portal";
import { ThemeProvider } from "next-themes";
import { ClientPortalHeader } from "./_components/header";
import { ClientPortalProvider } from "./_components/context/client-portal-context";
import { ConfirmationModal } from "@/components/modals/confirmation-modal/confirmation-modal";
import {
  getContrastColor,
  PORTAL_BRANDING_DEFAULTS,
} from "./_components/context/utils";
import type { PortalBranding } from "./_components/context/types";
import { getPresignedDownloadUrl } from "@/actions/s3";

const ClientPortalPage: React.FC<{ params: Promise<{ id: string }> }> = async ({
  params,
}) => {
  const { id } = await params;

  // Fetch the workflow/assignment with all required data
  let workflow;
  try {
    workflow = await prisma.templateClientAssignation.findUnique({
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
  } catch (error) {
    console.error("Error fetching workflow:", error);
  }

  // If workflow not found, return 404
  if (!workflow) {
    notFound();
  }

  // Load the branding configured by the template owner
  const brandingRow = workflow.template?.userId
    ? await prisma.userBranding
        .findUnique({
          where: { userId: workflow.template.userId },
        })
        .catch(() => null)
    : null;

  const branding: PortalBranding = {
    name: brandingRow?.name ?? PORTAL_BRANDING_DEFAULTS.name,
    logoUrl: brandingRow?.logoUrl ?? PORTAL_BRANDING_DEFAULTS.logoUrl,
    backgroundColor:
      brandingRow?.backgroundColor ?? PORTAL_BRANDING_DEFAULTS.backgroundColor,
    headerFooterColor:
      brandingRow?.headerFooterColor ??
      PORTAL_BRANDING_DEFAULTS.headerFooterColor,
    primaryColor:
      brandingRow?.primaryColor ?? PORTAL_BRANDING_DEFAULTS.primaryColor,
    fieldBackgroundColor:
      brandingRow?.fieldBackgroundColor ??
      PORTAL_BRANDING_DEFAULTS.fieldBackgroundColor,
    sectionCardBackgroundColor:
      brandingRow?.sectionCardBackgroundColor ??
      PORTAL_BRANDING_DEFAULTS.sectionCardBackgroundColor,
    sectionTitleColor:
      brandingRow?.sectionTitleColor ??
      PORTAL_BRANDING_DEFAULTS.sectionTitleColor,
    fieldTitleColor:
      brandingRow?.fieldTitleColor ?? PORTAL_BRANDING_DEFAULTS.fieldTitleColor,
    fieldSubtitleColor:
      brandingRow?.fieldSubtitleColor ??
      PORTAL_BRANDING_DEFAULTS.fieldSubtitleColor,
    inputBackgroundColor:
      brandingRow?.inputBackgroundColor ??
      PORTAL_BRANDING_DEFAULTS.inputBackgroundColor,
    uploadBackgroundColor:
      brandingRow?.uploadBackgroundColor ??
      PORTAL_BRANDING_DEFAULTS.uploadBackgroundColor,
    borderRadius:
      brandingRow?.borderRadius ?? PORTAL_BRANDING_DEFAULTS.borderRadius,
    titleTemplate:
      brandingRow?.titleTemplate ?? PORTAL_BRANDING_DEFAULTS.titleTemplate,
    submittedMessage:
      brandingRow?.submittedMessage ??
      PORTAL_BRANDING_DEFAULTS.submittedMessage,
  };

  // Prefer a fresh presigned URL so the logo renders on private buckets
  let logoDisplayUrl = branding.logoUrl;
  if (brandingRow?.logoKey) {
    const s3 = await getPresignedDownloadUrl(brandingRow.logoKey);
    if (s3.success && s3.downloadUrl) {
      logoDisplayUrl = s3.downloadUrl;
    }
  }

  const brandName =
    branding.name ?? workflow.template?.user?.name ?? "Organization";
  const primaryForeground = getContrastColor(branding.primaryColor);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <div
        className="min-h-screen bg-muted/20"
        style={
          {
            backgroundColor: branding.backgroundColor,
            "--radius": `${branding.borderRadius}px`,
            "--primary": branding.primaryColor,
            "--primary-foreground": primaryForeground,
            "--portal-field-bg": branding.fieldBackgroundColor,
            "--portal-section-bg": branding.sectionCardBackgroundColor,
            "--portal-section-title": branding.sectionTitleColor,
            "--portal-field-title": branding.fieldTitleColor,
            "--portal-field-subtitle": branding.fieldSubtitleColor,
            "--portal-input-bg": branding.inputBackgroundColor,
            "--portal-upload-bg": branding.uploadBackgroundColor,
          } as React.CSSProperties
        }
      >
        <ClientPortalProvider workflow={workflow} branding={branding}>
          <ClientPortalHeader
            organizationName={brandName}
            sentDate={workflow.submittedAt || new Date()}
            branding={branding}
            logoUrl={logoDisplayUrl}
          />
          <ClientPortal />
          <ConfirmationModal />
        </ClientPortalProvider>
      </div>
    </ThemeProvider>
  );
};

export default ClientPortalPage;
