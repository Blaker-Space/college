import React from "react";
import { Modal } from "./functions/ui";
import { btn, group } from "./styles";

// Modal component to display the summary of a refresh operation
export default function RefreshSummary({ summary, onClose }) {
  if (!summary) return null;

  const total = summary.total ?? 0;
  const success = summary.successCount ?? 0;
  const blockedCount = summary.blockedCount ?? 0;
  const failureCount = summary.failureCount ?? 0;

  return (
    <Modal
      open={!!summary}
      onClose={onClose}
      title="Refresh Results"
      footer={
        <div className={group.right}>
          <button className={btn.primary} onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-sm text-slate-700">
        <p>
          Attempted to refresh {summary?.total ?? 0} compan
          {summary?.total === 1 ? "y" : "ies"}. Updated{" "}
          {summary?.successCount ?? 0} successfully.
          {summary?.blockedCount ? " " : ""}
          {summary?.blockedCount
            ? `${summary.blockedCount} skipped due to robots.txt.`
            : ""}
          {summary?.failureCount ? " " : ""}
          {summary?.failureCount
            ? `${summary.failureCount} failed because of other errors.`
            : ""}
        </p>
        {summary?.blocked?.length ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-amber-600">
              Robots.txt restrictions
            </h4>
            <ul className="list-disc space-y-1 pl-5">
              {summary.blocked.map((entry) => (
                <li key={entry.id}>
                  <span className="font-semibold">{entry.name}</span>
                  {entry.message ? ` — ${entry.message}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {summary?.failures?.length ? (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-rose-600">
              Other issues
            </h4>
            <ul className="list-disc space-y-1 pl-5">
              {summary.failures.map((entry) => (
                <li key={entry.id}>
                  <span className="font-semibold">{entry.name}</span>
                  {entry.message ? ` — ${entry.message}` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {summary?.blocked?.length ? (
          <p className="text-xs text-slate-500">
            Rows blocked by robots.txt stay highlighted so you can follow up
            manually.
          </p>
        ) : null}
      </div>
    </Modal>
  );
}
