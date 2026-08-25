import { StatUI } from "@/components/ui/stats";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { AlertCircle, CheckCircle2, ClipboardList, Clock } from "lucide-react";

export const OverviewStats: React.FC<{ userId: string }> = async ({
  userId,
}) => {
  const userFilter = userId
    ? Prisma.sql`AND t."userId" = ${userId}`
    : Prisma.empty;

  const result = await prisma.$queryRaw<
    Array<{
      total_assignations: bigint;
      sum_completed_fields: bigint;
      sum_total_fields: bigint;
      missing_required_fields_count: bigint;
      overdue_assignations_count: bigint;
    }>
  >`
    SELECT 
      -- 1. Total matching assignations
      COUNT(DISTINCT tca.id) AS total_assignations,

      -- 2. Sum of completed fields across matching assignations
      COALESCE(SUM(DISTINCT tca."completedFieldsCount"), 0) AS sum_completed_fields,

      -- 3. Sum of total fields from associated templates
      COALESCE(SUM(DISTINCT t."totalFields"), 0) AS sum_total_fields,

      -- 4. Count of required fields in these assignations missing a completion value
      COUNT(DISTINCT tf.id) FILTER (
        WHERE tf.required = TRUE 
          AND fcv.id IS NULL
      ) AS missing_required_fields_count,

      -- 5. Number of overdue assignations (optional, if needed)
      COUNT(DISTINCT tca.id) FILTER (
        WHERE tca.status = 'OVERDUE' OR (tca.status = 'IN_PROGRESS' AND tca."dueDate" < NOW())
      ) AS overdue_assignations_count

    FROM "TemplateClientAssignation" tca
    INNER JOIN "Template" t ON tca."templateId" = t.id
    LEFT JOIN "TemplateSection" ts ON ts."templateId" = t.id
    LEFT JOIN "TemplateField" tf ON tf."sectionId" = ts.id
    LEFT JOIN "FieldCompletionValue" fcv 
           ON fcv."fieldId" = tf.id 
          AND fcv."assignationId" = tca.id
    WHERE tca.status IN ('IN_PROGRESS', 'ASSIGNED', 'OVERDUE')
    ${userFilter};
  `;

  const metrics = result[0];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatUI
        title="Active Requests"
        stat={metrics?.total_assignations.toString() ?? "0"}
        icon={<ClipboardList />}
      />

      <StatUI
        title="Completion Rate"
        stat={
          metrics && metrics.sum_total_fields > 0
            ? (
                (Number(metrics.sum_completed_fields) * 100) /
                Number(metrics.sum_total_fields)
              ).toFixed(2) + "%"
            : "0%"
        }
        icon={<CheckCircle2 />}
      />

      <StatUI
        title="Pending Documents"
        stat={
          metrics
            ? (metrics.missing_required_fields_count.toString() ?? "0")
            : "0"
        }
        icon={<AlertCircle />}
      />

      <StatUI
        title="Overdue"
        stat={
          metrics ? (metrics.overdue_assignations_count.toString() ?? "0") : "0"
        }
        icon={<Clock />}
      />
    </div>
  );
};
