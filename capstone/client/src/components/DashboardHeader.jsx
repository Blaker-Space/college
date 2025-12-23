import React from "react";
import { SignOutButton } from "@clerk/clerk-react";
import { btn, layout, group } from "././styles";
import { downloadCSV } from "././functions/api";

export default function DashboardHeader({
  user,
  isSignedIn,
  companies,
  setToasts,
  refreshing,
}) {
  return (
    <div className={layout.header}>
      <img
        src="/logo.png"
        alt="Company Logo"
        style={{ height: 160, objectFit: "contain" }}
      />
      <div className="flex flex-col items-end gap-1">
        {isSignedIn && (
          <span className="text-sm text-slate-200 pr-1">
            Logged in as <strong>{user?.username || "User"}</strong>
          </span>
        )}
        {!isSignedIn && (
          <span className="text-sm text-slate-200 pr-1">
            Logged in as Dev; Dev Mode
          </span>
        )}
        <div className={group.right}>
          <button
            className={btn.primary}
            onClick={() => downloadCSV(companies, setToasts)}
            disabled={refreshing || companies.length === 0}
          >
            Download CSV
          </button>
          <SignOutButton className={btn.danger}>Sign Out</SignOutButton>
        </div>
      </div>
    </div>
  );
}