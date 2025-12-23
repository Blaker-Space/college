import React from "react";
import { Modal, FieldRow, valueOrNone, stripeClass } from "././functions/ui";
import { btn, group, tbl, modal as modalStyles } from "././styles";
import { formatDateTime, getFieldValue } from "././functions/formutilities";
import { useUser } from "@clerk/clerk-react";

// Modal component to view and edit company details
function CompanyDetails({
  open,
  title,
  company,
  modals,
  requests,
  isModalRefreshing,
  forms,
  getFieldUIProps,
  viewFields,
  onClose,
  onCancelEdit,
  onSaveEdit,
  onEditChange,
  handleModelSelect,
  selectedModelId,
  availableModels,
  isLoadingModels,
  isAIScraping,
  submitRefresh,
  onStartEdit,
}) {
  const { user } = useUser();
  const actorName =
    (
      user?.username ||
      user?.fullName ||
      user?.primaryEmailAddress?.emailAddress ||
      ""
    ).trim() || "System";

  if (!company) return null;

  const isEditing = modals.edit;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        isEditing ? (
          <div className={group.right}>
            <button
              className={btn.success}
              onClick={onSaveEdit}
              disabled={requests.saving || isModalRefreshing}
            >
              {requests.saving ? "Saving." : "Save"}
            </button>
            <button className={btn.ghost} onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        ) : null
      }
    >
      <div className={modalStyles.divider} />
      {/* AI model selection + Refresh Data + Edit button */}
      {!isEditing && (
        <div className="mb-4 flex justify-right">
          <div className="my-1 flex items-center gap-3">
            {/* Label */}
            <label className="text-sm font-medium text-slate-700">
              A.I. Model:
            </label>

            {/* Select */}
            <div className="relative">
              <select
                className="rounded-lg p-1.5 text-sm outline-none border border-slate-300 bg-white text-slate-800"
                value={selectedModelId ?? ""}
                onChange={(e) => handleModelSelect?.(e.target.value)}
                disabled={isLoadingModels || !availableModels.length}
              >
                {isLoadingModels ? (
                  <option value="">Loading models...</option>
                ) : availableModels.length ? (
                  <>
                    <option
                      value=""
                      disabled={availableModels.some((m) => m.ready)}
                    >
                      {availableModels.some((m) => m.ready)
                        ? "Select an AI model"
                        : "No ready models - add API keys"}
                    </option>

                    {availableModels.map((model) => (
                      <option
                        key={model.id}
                        value={model.id}
                        disabled={!model.ready}
                      >
                        {model.label}
                        {!model.ready ? " (API key required)" : ""}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No models configured</option>
                )}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              className={
                btn.success +
                " text-sm flex items-center justify-center px-3 py-1.5"
              }
              onClick={submitRefresh}
              disabled={
                isAIScraping ||
                requests.refreshing ||
                isModalRefreshing ||
                !selectedModelId
              }
            >
              {requests.refreshing || isAIScraping
                ? "Refreshing..."
                : "Refresh Data"}
            </button>

            {/* Edit Button */}
            <button
              className={btn.primary + " text-sm px-3 py-1.5"}
              onClick={onStartEdit}
            >
              Edit
            </button>
          </div>
        </div>
      )}
      {isEditing ? (
        <p className="mb-3 text-xs text-slate-500">
          Changes you save will be recorded as
          <span className="font-semibold text-slate-700"> {actorName}</span>.
        </p>
      ) : null}
      <table className={tbl.root}>
        <tbody>
          {viewFields.map(({ key, label, type, editable }, index) => {
            const {
              error,
              datalistId,
              datalistOptions,
              inputProps,
              charLimit,
              options,
            } = getFieldUIProps("edit", key);
            return (
              <FieldRow
                key={key}
                label={label}
                type={type}
                edit={modals.edit && editable}
                value={getFieldValue(forms.edit, modals.details, key)}
                onChange={(v) => onEditChange(key, v)}
                rowIndex={index}
                error={error}
                datalistId={datalistId}
                datalistOptions={datalistOptions}
                inputProps={inputProps}
                charLimit={charLimit}
                options={options}
              />
            );
          })}
          {(() => {
            const lastStripe = stripeClass(viewFields.length);
            return (
              <tr className={lastStripe}>
                <th className={`${tbl.th} ${lastStripe}`}>
                  Last Updated Date/Time
                </th>
                <td className={`${tbl.td} ${lastStripe}`}>
                  {valueOrNone(
                    formatDateTime(
                      getFieldValue(
                        forms.edit,
                        modals.details,
                        "last_updated_datetime"
                      )
                    )
                  )}
                </td>
              </tr>
            );
          })()}
        </tbody>
      </table>
    </Modal>
  );
}

export default CompanyDetails;
