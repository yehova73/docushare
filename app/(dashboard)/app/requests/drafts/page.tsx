import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { DraftsTable } from "./_components/drafts-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const RequestDraftsPage: React.FC = async () => {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Assignation drafts"
        description={
          "Pick up where you left off. Drafts are saved automatically as you build a new assignation."
        }
        actions={
          <Link href="/app/new-assignation">
            <Button>
              <Plus /> New Request
            </Button>
          </Link>
        }
      />
      <DraftsTable />
    </div>
  );
};

export default RequestDraftsPage;
