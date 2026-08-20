import { getUserFromSession } from "@/actions/account/account";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { AddReminderSheetTrigger } from "@/components/modals/add-reminder-sheet/add-reminder-sheet";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { RemindersList } from "./_components/reminders-list";

const RemindersPage: React.FC = async () => {
  const user = await getUserFromSession();

  const reminders = await prisma.reminder.findMany({
    where: {
      userId: user?.id,
      batchId: null,
    },
  });

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Automated Reminders"
        description="Manage your automated reminders for clients and workflows."
        actions={<AddReminderSheetTrigger />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RemindersList reminders={reminders} />
        <Card className="h-min">
          <CardHeader>
            <CardTitle>Sent Reminders History</CardTitle>
            <CardDescription>
              View the history of reminders that have been sent to clients.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default RemindersPage;
