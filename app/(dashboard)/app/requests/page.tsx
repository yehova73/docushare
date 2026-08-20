import { AssignWorkflowToClientSheetTrigger } from "@/components/modals/assign-workflow-to-client-sheet/assign-workflow-to-client-sheet";
import { RequestsTable } from "./_components/requests-table";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileEdit, Plus } from "lucide-react";

const RequestPage: React.FC = async () => {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Requests"
        description={"Manage your document requests and track their progress."}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/app/requests/drafts">
              <Button variant={"secondary"}>
                <FileEdit /> Draft Requests
              </Button>
            </Link>
            <Link href="/app/new-assignation">
              <Button>
                <Plus /> New Request
              </Button>
            </Link>
          </div>
        }
      />
      <RequestsTable />
    </div>
  );
};

export default RequestPage;
