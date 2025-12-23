import React from "react";
import { Modal } from "./functions/ui";
import { btn, group } from "./styles";

export default function BulkRefreshConfirm({
  open,
  count,
  onConfirm,
  onCancel,
  refreshing
}) {
  const hasCompanies = count > 0;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Refresh all companies?"
      footer={
        <div className={group.right}>
          <button
            className={btn.danger}
            onClick={onConfirm}
            disabled={refreshing || !hasCompanies}
          >
            {refreshing ? "Refreshing..." : "Refresh All"}
          </button>
          <button className={btn.ghost} onClick={onCancel} disabled={refreshing}>
            Cancel
          </button>
        </div>
      }
    >
      <p>
        This will fetch updated website data for {count} compan
        {count === 1 ? "y" : "ies"}. <br />
        Please be mindful of token usage and only run refreshes when necessary; this may take several minutes depending on how many need updating.
      </p>
    </Modal>
  );
}