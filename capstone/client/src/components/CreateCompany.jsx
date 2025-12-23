import React from "react";
import { Modal, FormField } from "./functions/ui";
import { FIELD_CHAR_LIMITS } from "./functions/definitions";
import { US_STATES } from "./functions/definitions";
import { btn, group } from "./styles";

// Modal component to create a new company
export default function CreateCompanyModal({
  open,
  onClose,
  onCreate,
  scrapeUrl,
  setScrapeUrl,
  isAIScraping,
  submitScrape,
  selectedModelId,
  availableModels,
  isLoadingModels,
  handleModelSelect,
  aiDescriptionDisplayText,
  forms,
  handleNewCompanyChange,
  createWebsiteFieldProps,
  createPhoneFieldProps,
  createEmailFieldProps,
  createCityFieldProps,
  createStateFieldProps,
  createPostalFieldProps,
  fieldCardBase,
  fieldCardFull,
  form,
  modalStyles,
  actorName = "System",
}) {
  const hasReadyModels = Array.isArray(availableModels)
    ? availableModels.some((m) => m.ready)
    : false;
  const [isScrapeUrlFocused, setIsScrapeUrlFocused] = React.useState(false);
  const scrapeUrlCharLimit = FIELD_CHAR_LIMITS.website_url;
  const scrapeUrlLength = (scrapeUrl ?? "").length;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New Company"
      footer={
        <div className={group.right}>
          <button className={btn.success} onClick={onCreate} disabled={false}>
            {false ? "Creating..." : "Create Company"}
          </button>
          <button className={btn.ghost} onClick={onClose}>
            Cancel
          </button>
        </div>
      }
    >
      <div className={modalStyles.divider} />
      <p className="mb-4 text-xs text-slate-500">
        New companies you create will list
        <span className="font-semibold text-slate-700"> {actorName}</span> as
        the last person to update them.
      </p>
      <div className="space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
            <label className="flex flex-col gap-1.5 sm:w-48">
              <span className="text-sm font-medium text-slate-600">
                A.I. Model
              </span>
              <div className="relative">
                <select
                  className={form.select}
                  value={selectedModelId}
                  onChange={(e) => handleModelSelect(e.target.value)}
                  disabled={isLoadingModels || !availableModels.length}
                >
                  {isLoadingModels ? (
                    <option value="">Loading models...</option>
                  ) : availableModels.length ? (
                    <>
                      <option value="" disabled={hasReadyModels}>
                        {hasReadyModels
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
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </span>
              </div>
              {!isLoadingModels && availableModels.length && !hasReadyModels ? (
                <p className="mt-1 text-xs text-amber-600">
                  Add your AI provider API keys in the server .env to enable
                  models.
                </p>
              ) : null}
            </label>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex-1">
                <span className="block text-sm font-medium text-slate-600 mb-1">
                  Website URL
                </span>
                <input
                  type="text"
                  placeholder="Enter a URL to AI Scrape..."
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      submitScrape();
                    }
                  }}
                  className={form.input}
                  maxLength={scrapeUrlCharLimit}
                  onFocus={() => setIsScrapeUrlFocused(true)}
                  onBlur={() => setIsScrapeUrlFocused(false)}
                />
                {isScrapeUrlFocused ? (
                  <span className="mt-1 text-[11px] italic text-slate-500">
                    {scrapeUrlLength}/{scrapeUrlCharLimit} characters
                  </span>
                ) : null}
              </label>
              <div className="flex gap-2 sm:self-center sm:mt-3.5">
                <button
                  type="button"
                  className={btn.success}
                  onClick={submitScrape}
                  disabled={isAIScraping || !selectedModelId || isLoadingModels}
                >
                  {isAIScraping ? "Scraping..." : "AI Scrape"}
                </button>
                <button
                  type="button"
                  className={btn.ghost}
                  onClick={() => setScrapeUrl("")}
                  disabled={isAIScraping || !scrapeUrl}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </section>

        {aiDescriptionDisplayText && (
          <section className="rounded-2xl border border-indigo-100 bg-white/70 px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-800">
                AI Description
              </span>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {aiDescriptionDisplayText}
              </p>
            </div>
          </section>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreate();
          }}
          className="space-y-4"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className={fieldCardFull}>
              <FormField
                label="Company Name"
                type="text"
                required
                placeholder="Enter company name"
                value={forms.create?.company_name ?? ""}
                onChange={(v) => handleNewCompanyChange("company_name", v)}
                charLimit={FIELD_CHAR_LIMITS.company_name}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-3 sm:flex-row">
              <div className={`${fieldCardBase} sm:flex-1`}>
                <FormField
                  label="Website"
                  type="url"
                  placeholder="www.example.com"
                  value={forms.create?.website_url ?? ""}
                  onChange={(v) => handleNewCompanyChange("website_url", v)}
                  error={createWebsiteFieldProps.error}
                  datalistId={createWebsiteFieldProps.datalistId}
                  datalistOptions={createWebsiteFieldProps.datalistOptions}
                  inputProps={createWebsiteFieldProps.inputProps}
                  charLimit={createWebsiteFieldProps.charLimit}
                />
              </div>
              <div className={`${fieldCardBase} sm:flex-1`}>
                <FormField
                  label="Phone"
                  type="text"
                  placeholder="123-456-7890"
                  value={forms.create?.phone_number ?? ""}
                  onChange={(v) => handleNewCompanyChange("phone_number", v)}
                  error={createPhoneFieldProps.error}
                  datalistId={createPhoneFieldProps.datalistId}
                  datalistOptions={createPhoneFieldProps.datalistOptions}
                  inputProps={createPhoneFieldProps.inputProps}
                />
              </div>
              <div className={`${fieldCardBase} sm:flex-1`}>
                <FormField
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={forms.create?.email_address ?? ""}
                  onChange={(v) => handleNewCompanyChange("email_address", v)}
                  error={createEmailFieldProps.error}
                  datalistId={createEmailFieldProps.datalistId}
                  datalistOptions={createEmailFieldProps.datalistOptions}
                  inputProps={createEmailFieldProps.inputProps}
                  charLimit={createEmailFieldProps.charLimit}
                />
              </div>
            </div>
            <div className={fieldCardFull}>
              <FormField
                label="Street Address"
                type="text"
                placeholder="Enter street address"
                value={forms.create?.street_address ?? ""}
                onChange={(v) => handleNewCompanyChange("street_address", v)}
                charLimit={FIELD_CHAR_LIMITS.street_address}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-3 sm:flex-row">
              <div className={`${fieldCardBase} sm:flex-1`}>
                <FormField
                  label="City"
                  type="text"
                  placeholder="City"
                  value={forms.create?.city ?? ""}
                  onChange={(v) => handleNewCompanyChange("city", v)}
                  error={createCityFieldProps.error}
                  datalistId={createCityFieldProps.datalistId}
                  datalistOptions={createCityFieldProps.datalistOptions}
                  inputProps={createCityFieldProps.inputProps}
                  charLimit={createCityFieldProps.charLimit}
                />
              </div>
              <div className={`${fieldCardBase} sm:flex-1`}>
                <FormField
                  label="State"
                  type="select"
                  placeholder="Select a state"
                  value={forms.create?.state ?? ""}
                  onChange={(v) => handleNewCompanyChange("state", v)}
                  error={createStateFieldProps.error}
                  options={US_STATES}
                  inputProps={createStateFieldProps.inputProps}
                />
              </div>
              <div className={`${fieldCardBase} sm:flex-1`}>
                <FormField
                  label="Zip Code"
                  type="text"
                  placeholder="Zip Code"
                  value={forms.create?.postal_code ?? ""}
                  onChange={(v) => handleNewCompanyChange("postal_code", v)}
                  error={createPostalFieldProps.error}
                  datalistId={createPostalFieldProps.datalistId}
                  datalistOptions={createPostalFieldProps.datalistOptions}
                  inputProps={createPostalFieldProps.inputProps}
                />
              </div>
            </div>
            <div className={fieldCardFull}>
              <FormField
                label="Notes"
                type="textarea"
                placeholder="Add any notes gathered about this company"
                value={forms.create?.note_text ?? ""}
                onChange={(v) => handleNewCompanyChange("note_text", v)}
                charLimit={FIELD_CHAR_LIMITS.note_text}
              />
            </div>
          </div>
          <button
            type="submit"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        </form>
      </div>
    </Modal>
  );
}
