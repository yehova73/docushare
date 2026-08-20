import { getUserFromSession } from "@/actions/account/account";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { OverviewStats } from "./_components/stats";
import { RequestsTable } from "./requests/_components/requests-table";
import { QuickStart } from "./templates/_components/quick-start";
import { RecentActivity } from "./templates/_components/recent-activity";
import { RequestsNeedingAttention } from "./templates/_components/requests-needing-attention";

const DashboardPage: React.FC = async () => {
  const user = await getUserFromSession();

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Overview"
        description={
          "Welcome to your dashboard! Here you can manage your clients, workflows, and templates."
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/app/new-assignation">
              <Button>
                <Plus /> New Request
              </Button>
            </Link>
          </div>
        }
      />
      <OverviewStats userId={user?.id ?? ""} />
      {/* {sub.states.isTrialActive && (
        <TrialBox
          trialExpirationDate={
            sub.states.trialEndsAt || addMonths(new Date(), 1)
          }
        />
      )} */}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 lg:col-span-2 h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Requests Needing Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                }
              >
                <RequestsNeedingAttention userId={user?.id ?? ""} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <QuickStart userId={user?.id ?? ""} />
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant={"secondary"} size={"xs"}>
                View All <ArrowRight />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <RecentActivity userId={user?.id ?? ""} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <RequestsTable isOverview />
        </CardContent>
      </div>
    </div>
  );
};

export default DashboardPage;
