import { getUserFromSession } from "@/actions/account/account";
import { isTextField } from "@/app/client-portal/[id]/_components/context/utils";
import { DashboardPageHeader } from "@/components/dashboard-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatUI } from "@/components/ui/stats";
import { prisma } from "@/lib/prisma";
import { capitalize } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AlarmClock, Info, ListCheck, User } from "lucide-react";
import { DownloadFileButton } from "./_components/download-file-button";
import { DownloadArchiveButton } from "./_components/download-archive-button";
import { ClientUpdatesCard } from "./_components/client-updates-card";
import { RequestRemindersCard } from "./_components/request-reminders-card";
import { RequestPageOptionsButton } from "./_components/options-button";

const RequestPage: React.FC<{ params: Promise<{ id: string }> }> = async ({
  params,
}) => {
  const user = await getUserFromSession();
  const { id } = await params;

  const assignment = await prisma.templateClientAssignation.findUnique({
    where: { id, template: { userId: user?.id } },
    include: {
      template: {
        include: {
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
                orderBy: {
                  order: "asc",
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

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      <DashboardPageHeader
        title={
          <div className="max-w-[800px] truncate">
            {`${assignment?.name || assignment?.template.name || "Unnamed"} request for ${assignment?.client.name || "Unknown client"}`}
          </div>
        }
        description={`Manage the responses of the request for the workflow "${assignment?.template.name || "Unnamed"}" assigned to ${assignment?.client.name || "Unknown client"}.`}
        actions={
          <div className="flex items-center gap-2">
            <RequestPageOptionsButton
              id={id}
              clientName={assignment?.client.name || "Unknown client"}
              clientFolderId={assignment?.clientFolderId || undefined}
            />
            <DownloadArchiveButton
              fields={
                assignment?.template.sections.flatMap(
                  (section) => section.fields,
                ) || []
              }
            />
          </div>
        }
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatUI
          title="Client"
          stat={assignment?.client.name || "Unknown client"}
          label={`${assignment?.client.email || "No email"}`}
          size="small"
          icon={<User />}
        />
        <StatUI
          title="Workflow"
          stat={
            <div className="line-clamp-1">
              {assignment?.template.name || "Unnamed"}
            </div>
          }
          label={`${assignment?.template.category || "No category"}`}
          size="small"
          icon={<ListCheck />}
        />
        <StatUI
          title="Due Date"
          stat={
            assignment?.dueDate
              ? assignment.dueDate.toDateString()
              : "No due date"
          }
          size="small"
          icon={<AlarmClock />}
          label={
            assignment?.dueDate
              ? `Due ${formatDistanceToNow(assignment.dueDate, { addSuffix: true })} `
              : "No due date set"
          }
        />
        <StatUI
          title="Status"
          stat={capitalize(
            (assignment?.status || "Unknown")
              .toLowerCase()
              .replaceAll("_", " "),
          )}
          size="small"
          icon={<Info />}
          label={`${assignment?.completedFieldsCount || 0} of ${assignment?.totalFieldsCount || 0} fields completed`}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 sm:col-span-2 space-y-6">
          {assignment?.template.sections.map((section, i) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.name || `Section ${i + 1}`}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {section.fields.map((field) => (
                  <div key={field.id} className="flex flex-col gap-1">
                    <div className="font-medium text-foreground">
                      {field.name || "Unnamed field"}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {field.description || "No description"}
                    </div>
                    <div className="text-sm text-foreground">
                      {isTextField(field) && (
                        <div className="py-2 px-3 bg-muted rounded-md">
                          {field.completionValue?.value || (
                            <span className="text-muted-foreground">
                              No value provided
                            </span>
                          )}
                        </div>
                      )}
                      {!isTextField(field) &&
                        (!field.completionValue?.files.length ? (
                          <div className="py-2 px-3 bg-muted rounded-md text-muted-foreground">
                            No files uploaded
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {field.completionValue.files.map((file) => {
                              return (
                                <div
                                  key={file.id}
                                  className="py-2 px-3 bg-muted rounded-md flex justify-between items-center gap-2"
                                >
                                  {file.fileName}
                                  <DownloadFileButton file={file} />
                                </div>
                              );
                            })}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="col-span-1 space-y-6">
          <ClientUpdatesCard
            assignationId={assignment?.id || ""}
            userId={user.id}
          />
          <RequestRemindersCard
            assignationId={assignment?.id || ""}
            userId={user.id}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
