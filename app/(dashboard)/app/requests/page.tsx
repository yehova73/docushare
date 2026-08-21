import { getClientsAction } from "@/actions/clients/get-clients";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { Button } from "@/components/ui/button";
import { AssignedTemplateStatus } from "@/lib/generated/prisma/enums";
import { Plus } from "lucide-react";
import Link from "next/link";
import { RequestsFilters } from "./_components/requests-filters";
import { RequestsTable } from "./_components/requests-table";

const VALID_STATUSES = new Set<string>(Object.values(AssignedTemplateStatus));

const RequestPage: React.FC<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}> = async ({ searchParams }) => {
  const sp = await searchParams;

  const search = typeof sp.search === "string" ? sp.search : "";

  const status =
    typeof sp.status === "string" && VALID_STATUSES.has(sp.status)
      ? (sp.status as AssignedTemplateStatus)
      : "ALL";

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
        title="Requests"
        description={"Manage your document requests and track their progress."}
        actions={
          <div className="flex items-center gap-2">
            <RequestsFilters clients={clients} />
            <Link href="/app/new-assignation">
              <Button>
                <Plus /> New Request
              </Button>
            </Link>
          </div>
        }
      />
      <RequestsTable search={search} clientIds={clientIds} status={status} />
    </div>
  );
};

export default RequestPage;
