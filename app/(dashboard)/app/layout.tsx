import type { Metadata } from "next";
import { getPotentialUserFromSession } from "@/actions/account/account";
import { getCurrentSubscriptionAction } from "@/actions/account/subscriptions/get-current-subscription";
import { PaymentCompleteModal } from "@/components/modals/payment-complete-modal/payment-complete-modal";
import { DashboardProviders } from "@/components/providers";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type React from "react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "DocFetch — Dashboard",
  description:
    "Collect documents, files, and information from clients with one secure link. Files land directly in your Google Drive.",
  openGraph: {
    title: "DocFetch — Dashboard",
    description:
      "Collect documents, files, and information from clients with one secure link. Files land directly in your Google Drive.",
    url: "https://docfetch.app",
    siteName: "DocFetch",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocFetch — Secure document collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocFetch — Dashboard",
    description:
      "Collect documents and files from clients with one secure link. Stop chasing — files land in your Google Drive.",
    images: ["/og-image.png"],
  },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getPotentialUserFromSession();
  if (!user) {
    return redirect("/login");
  }

  const userDetails = await prisma.user.findFirst({
    where: { id: user.id },
    select: {
      hasCompletedOnboardingAt: true,
    },
  });

  const cookiesState = await cookies();
  const sidebarCookie = cookiesState.get("sidebar_state");

  const sub = await getCurrentSubscriptionAction();

  return (
    <DashboardProviders>
      <div className="[--header-height:calc(--spacing(14))]" id="dashboard">
        <SidebarProvider
          className="flex flex-col"
          defaultOpen={sidebarCookie?.value !== "false"}
        >
          {/* <DashboardHeader
            organizations={
              userDetails?.organizations.map((x) => x.organization) || []
            }
          /> */}
          {/* {!hasOrganizations && <NoOrganizationsZeroState />} */}

          <div className="flex flex-1">
            <AppSidebar
              user={{
                name: user.name || "",
                image: user.image || "",
                email: user.email || "",
              }}
              subscription={{
                isTrial: sub.states.isTrialActive,
              }}
            />
            {/* overflow-auto max-h-[calc(100vh-48px)] */}
            <SidebarInset className=" relative ">
              <main className="p-2 md:p-6 min-h-[calc(100vh-var(--header-height)-2px)]">
                <div className="flex-1 flex flex-col h-full  w-full mx-auto ">
                  {children}
                </div>
              </main>
            </SidebarInset>
          </div>
          {/* <FeedbackDialog />
          <CreateWorkspaceModal />
          <EditWorkspaceDetailsModal />
          <EditWorkspaceLinksModal />
          <NewGroupModal />
          <DeleteGroupModal />
          <DuplicateWorkspaceModal />
          <ConfirmationModal /> */}
          <Suspense>
            <PaymentCompleteModal />
          </Suspense>
        </SidebarProvider>
      </div>
    </DashboardProviders>
  );
}
