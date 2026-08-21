import { getClientsAction } from "@/actions/clients/get-clients";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DraftsFilters } from "./_components/drafts-filters";
import { DraftsTable } from "./_components/drafts-table";

const RequestDraftsPage: React.FC<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}> = async ({ searchParams }) => {
  const sp = await searchParams;

  const search = typeof sp.search === "string" ? sp.search : "";

  const clientIds =
    typeof sp.clientIds === "string"
      ? sp.clientIds
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

  const clients = (await getClientsAction()).data?.clients ?? [];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title="Assignation drafts"
        description={
          "Pick up where you left off. Drafts are saved automatically as you build a new assignation."
        }
        actions={
          <div className="flex items-center gap-2">
            <DraftsFilters clients={clients} />
            <Link href="/app/new-assignation">
              <Button>
                <Plus /> New Request
              </Button>
            </Link>
          </div>
        }
      />
      <DraftsTable search={search} clientIds={clientIds} />
    </div>
  );
};

export default RequestDraftsPage;
