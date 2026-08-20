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
  title: "Tabzo: Freeze, Focus, and Restore Your Workspaces",
  description:
    "Organize active Chrome windows into persistent workspaces. Auto-sync open tabs, customize focus hubs with Tab-0, and time-travel through snapshot state history across every device.",
  openGraph: {
    title: "Tabzo: Freeze, Focus, and Restore Your Workspaces",
    description:
      "Organize active Chrome windows into persistent workspaces. Auto-sync open tabs, customize focus hubs with Tab-0, and time-travel through snapshot state history across every device.",
    url: "https://tabzo.app",
    siteName: "Tabzo",
    images: [
      {
        url: "https://tabzo.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tabzo - Window & Tab Management Workspace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tabzo: Freeze, Focus, and Restore Your Workspaces",
    description:
      "Organize active Chrome windows into persistent workspaces with real-time tab syncing and time-travel state recovery.",
    images: ["https://tabzo.app/og-image.png"],
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
          // defaultOpen={sidebarCookie?.value === "true"}
          defaultOpen={true}
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
