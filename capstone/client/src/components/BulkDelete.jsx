import React from "react";
import { Modal } from "././functions/ui";
import { btn, group } from "././styles";

// Modal component for confirming bulk deletion of companies
export default function BulkDelete({
  open,
  count,
  deleting,
  onConfirm,
  onCancel,
}) {
  const hasBulkSelection = count > 0;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Delete selected companies?"
      footer={
        <div className={group.right}>
          <button
            className={btn.danger}
            onClick={onConfirm}
            disabled={!hasBulkSelection || deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <button
            className={btn.ghost}
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
        </div>
      }
    >
      <p>
        This will permanently delete {count} selected compan
        {count === 1 ? "y" : "ies"}. This action cannot be
        undone.
      </p>
    </Modal>
  );
}
