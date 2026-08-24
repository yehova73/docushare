import { verifyWebhookSecret } from "@/lib/webhook-auth";
import ReminderEmail from "@/emails/reminder-email";
import { sendEmail } from "@/lib/emails/send-email";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";

export const runtime = "nodejs";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_SENDER_NAME = "Tabzo";
const DEFAULT_SENDING_HOUR = 9;

type ReminderWithAssignment = Prisma.ReminderGetPayload<{
  include: {
    assignment: { include: { client: true; template: true } };
  };
}>;

function firstOccurrenceDays(reminder: ReminderWithAssignment) {
  if (reminder.scheduleType === "AFTER") return reminder.afterDays ?? 0;
  return reminder.afterDays && reminder.afterDays > 0
    ? reminder.afterDays
    : (reminder.everyDays ?? 0);
}

function getTriggerDate(
  reminder: ReminderWithAssignment,
  assignment: NonNullable<ReminderWithAssignment["assignment"]>,
) {
  switch (reminder.reminderType) {
    case "ASSIGNMENT_STARTED":
      return assignment.submittedAt;
    case "ASSIGNMENT_COMPLETED":
      return assignment.completedAt;
    case "ASSIGNMENT_OVERDUE":
      return assignment.dueDate;
    case "ASSIGNMENT_REMINDER":
      return assignment.assignedAt
        ? new Date(
            assignment.assignedAt.getTime() +
              firstOccurrenceDays(reminder) * DAY_MS,
          )
        : null;
    case "ASSIGNMENT_DUE_SOON":
      return assignment.dueDate
        ? new Date(
            assignment.dueDate.getTime() -
              firstOccurrenceDays(reminder) * DAY_MS,
          )
        : null;
    case "ASSIGNMENT_OVERDUE_REMINDER":
      return assignment.dueDate
        ? new Date(
            assignment.dueDate.getTime() +
              firstOccurrenceDays(reminder) * DAY_MS,
          )
        : null;
    default:
      return null;
  }
}

function getOccurrences(
  reminder: ReminderWithAssignment,
  assignment: NonNullable<ReminderWithAssignment["assignment"]>,
  now: Date,
  sendingHour: number,
) {
  const trigger = getTriggerDate(reminder, assignment);
  if (!trigger || trigger > now) return [];

  const firstOccurrence = new Date(trigger);
  firstOccurrence.setUTCHours(sendingHour, 0, 0, 0);
  const isToday =
    trigger.getUTCFullYear() === now.getUTCFullYear() &&
    trigger.getUTCMonth() === now.getUTCMonth() &&
    trigger.getUTCDate() === now.getUTCDate();
  if (isToday && firstOccurrence < trigger) {
    firstOccurrence.setUTCDate(firstOccurrence.getUTCDate() + 1);
  }

  if (reminder.scheduleType !== "EVERY") {
    return firstOccurrence <= now ? [firstOccurrence] : [];
  }

  const intervalDays = reminder.everyDays ?? 0;
  if (intervalDays <= 0) return [];

  const occurrences: Date[] = [];
  let occurrence = firstOccurrence;
  while (occurrence <= now && occurrences.length < 366) {
    occurrences.push(occurrence);
    occurrence = new Date(occurrence.getTime() + intervalDays * DAY_MS);
  }
  return occurrences;
}

function replaceVariables(
  content: string,
  assignment: NonNullable<ReminderWithAssignment["assignment"]>,
) {
  const values: Record<string, string> = {
    "{{client.name}}": assignment.client.name,
    "{{client.email}}": assignment.client.email ?? "",
    "{{client.company}}": assignment.client.company ?? "",
    "{{client.phone}}": assignment.client.phone ?? "",
    "{{workflow.name}}": assignment.name || assignment.template.name,
    "{{workflow.description}}": assignment.template.description ?? "",
    "{{workflow.dueDate}}":
      assignment.dueDate?.toLocaleDateString("en-US") ?? "No due date",
    "{{workflow.status}}": assignment.status,
    "{{workflow.progress}}": `${assignment.completedFieldsCount}/${assignment.totalFieldsCount}`,
    "{{workflow.remainingFields}}": String(
      Math.max(
        0,
        assignment.totalFieldsCount - assignment.completedFieldsCount,
      ),
    ),
  };

  return content.replace(
    /{{[^}]+}}/g,
    (variable) => values[variable] ?? variable,
  );
}

export async function POST(request: NextRequest) {
  if (!verifyWebhookSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const reminders = await prisma.reminder.findMany({
    where: {
      assignment: {
        status: { in: ["ASSIGNED", "IN_PROGRESS", "OVERDUE"] },
        completedAt: null,
      },
    },
    include: {
      assignment: { include: { client: true, template: true } },
      user: { include: { reminderSettings: true } },
    },
  });

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const reminder of reminders) {
    const assignment = reminder.assignment;
    if (!assignment?.client.email) {
      skipped++;
      continue;
    }

    const sendingHour =
      reminder.user.reminderSettings?.sendingHour ?? DEFAULT_SENDING_HOUR;
    const senderName =
      reminder.user.reminderSettings?.senderName || DEFAULT_SENDER_NAME;
    const occurrences = getOccurrences(reminder, assignment, now, sendingHour);

    for (const occurrence of occurrences) {
      const occurrenceKey = occurrence.toISOString();
      let claim;
      try {
        claim = await prisma.sentReminder.create({
          data: {
            userId: reminder.userId,
            reminderId: reminder.id,
            assignmentId: assignment.id,
            occurrenceKey,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          skipped++;
          continue;
        }
        throw error;
      }

      try {
        const response = await sendEmail({
          component: ReminderEmail,
          receiver: assignment.client.email,
          subject: replaceVariables(reminder.subject, assignment),
          props: {
            title: replaceVariables(reminder.subject, assignment),
            content: replaceVariables(reminder.content, assignment),
          },
          senderEmail: process.env.BREVO_SENDER_EMAIL || "no-reply@tabzo.app",
          senderName,
        });
        await prisma.sentReminder.update({
          where: { id: claim.id },
          data: { providerId: response?.messageId },
        });
        sent++;
      } catch (error) {
        await prisma.sentReminder.delete({ where: { id: claim.id } });
        errors.push(
          `${reminder.id}: ${error instanceof Error ? error.message : "send failed"}`,
        );
      }
    }
  }

  return NextResponse.json({ sent, skipped, errors });
}
