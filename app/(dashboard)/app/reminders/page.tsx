import { getUserFromSession } from "@/actions/account/account";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { AddReminderSheetTrigger } from "@/components/modals/add-reminder-sheet/add-reminder-sheet";
import { prisma } from "@/lib/prisma";
import { ReminderType } from "@/lib/generated/prisma/browser";
import { RemindersFilters } from "./_components/reminders-filters";
import { RemindersList } from "./_components/reminders-list";

const VALID_TYPES = new Set<string>(Object.values(ReminderType));

const RemindersPage: React.FC<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}> = async ({ searchParams }) => {
  const user = await getUserFromSession();

  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : "";
  const type =
    typeof sp.type === "string" && VALID_TYPES.has(sp.type) ? sp.type : "ALL";

  const reminders = await prisma.reminder.findMany({
    where: {
      userId: user?.id,
      batchId: null,
      assignmentId: null,
    },
  });

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Automated Reminders"
        description="Manage your automated reminders for clients and workflows."
        actions={
          <div className="flex items-center gap-2">
            <RemindersFilters />
            <AddReminderSheetTrigger />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6">
        <RemindersList reminders={reminders} search={search} type={type} />
        {/* <Card className="h-min">
          <CardHeader>
            <CardTitle>Sent Reminders History</CardTitle>
            <CardDescription>
              View the history of reminders that have been sent to clients.
            </CardDescription>
          </CardHeader>
        </Card> */}
      </div>
    </div>
  );
};

export default RemindersPage;
