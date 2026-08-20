"use client";

import { Download, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { SectionTitle } from "../../_components/components";
import { getInvoicesAction } from "@/actions/account/subscriptions/get-invoices";

type InvoicePage = Awaited<ReturnType<typeof getInvoicesAction>>;

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp * 1000));

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);

export const Invoices: React.FC<{ initialPage: InvoicePage }> = ({
  initialPage,
}) => {
  const [page, setPage] = useState(initialPage);
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([
    undefined,
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  async function goToNextPage() {
    if (!page.hasMore || !page.nextCursor) return;

    setIsLoading(true);
    try {
      const nextPage = await getInvoicesAction(page.nextCursor);
      setPage(nextPage);
      setCursorHistory((history) => [...history, page.nextCursor!]);
      setPageIndex((index) => index + 1);
    } finally {
      setIsLoading(false);
    }
  }

  async function goToPreviousPage() {
    if (pageIndex === 0) return;

    setIsLoading(true);
    try {
      const previousPage = await getInvoicesAction(
        cursorHistory[pageIndex - 1],
      );
      setPage(previousPage);
      setCursorHistory((history) => history.slice(0, -1));
      setPageIndex((index) => index - 1);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <SectionTitle>Invoicing</SectionTitle>
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        {page.invoices.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No invoices yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Date</th>
                <th className="text-left font-medium px-4 py-3">Invoice ID</th>
                <th className="text-left font-medium px-4 py-3">Amount</th>
                <th className="text-right font-medium px-4 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {page.invoices.map((invoice, index) => (
                <tr
                  key={invoice.id}
                  className={index > 0 ? "border-t" : ""}
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDate(invoice.created)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {invoice.number || invoice.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatAmount(invoice.amount, invoice.currency)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {invoice.receiptUrl ? (
                      <a
                        href={invoice.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs"
                      >
                        <Download className="h-3.5 w-3.5" /> View
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {(pageIndex > 0 || page.hasMore) && (
          <div
            className="flex items-center justify-between border-t px-4 py-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={pageIndex === 0 || isLoading}
              className="rounded-md border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: "var(--color-border)" }}
            >
              Previous
            </button>
            <span className="text-xs text-muted-foreground">
              Page {pageIndex + 1}
            </span>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={!page.hasMore || isLoading}
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: "var(--color-border)" }}
            >
              {isLoading && (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              )}
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
