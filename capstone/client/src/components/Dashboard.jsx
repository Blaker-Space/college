import React, { useMemo, useCallback, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { viewFields } from "./functions/definitions";
import { btn, layout, form, tbl, modal as modalStyles } from "./styles";
import {
  detectDuplicateCompany,
  normalizeWebsite,
  getSecureUrl
} from "./functions/formutilities";
import { toastStack } from "./functions/ui";

// Hooks
import {
  useModals,
  useFormManager,
  useCompanies,
  useAIModels,
  useDirectoryScraper,
  useRefreshAll,
  useToasts,
  useSearch,
  useScrape,
  useName,
  useRowSelection
} from "./hooks";

// Components
import { CompanyTable, DashboardHeader, SearchBar } from "./";

// Existing components
import DirectoryScraper from "./DirectoryScraper";
import RefreshAI from "./RefreshAI";
import BulkDelete from "./BulkDelete";
import RefreshSummary from "./RefreshSummary";
import CompanyDetails from "./CompanyDetails";
import CreateCompany from "./CreateCompany";
import RefreshCheck from "./RefreshCheck";

export default function Dashboard() {
  const { user, isSignedIn } = useUser();
  const userName = useName(user);

  // Core hooks
  const { toasts, setToasts, showToast } = useToasts();
  const modals = useModals();
  const formManager = useFormManager();
  const companiesHook = useCompanies();
  const aiModels = useAIModels();

  // Search
  const {
    searchQuery,
    setSearchQuery,
    displaySearchQuery,
    hasSearchQuery,
    filteredCompanies,
    filteredCount,
    clearSearch,
  } = useSearch(companiesHook.companies);

  // Row selection (uses filtered list)
  const rowSelection = useRowSelection(filteredCompanies);

  // Directory scraper with companies update callback
  const directoryScraper = useDirectoryScraper(
    useCallback(
      (updated) => companiesHook.setCompanies(updated),
      [companiesHook.setCompanies]
    )
  );

  // Bulk refresh
  const refreshAll = useRefreshAll(
    useCallback(
      (updated) => companiesHook.setCompanies(updated),
      [companiesHook.setCompanies]
    ),
    showToast,
    userName
  );

  // Scrape hook
  const scrape = useScrape({
    showToast,
    availableModels: aiModels.availableModels,
    selectedModelId: aiModels.selectedModelId,
    isLoadingModels: aiModels.isLoadingModels,
    setLastScrapeMeta: aiModels.setLastScrapeMeta,
    onCompaniesUpdate: useCallback(
      (updated) => companiesHook.setCompanies(updated),
      [companiesHook.setCompanies]
    ),
  });

  // Local state
  const [isModalRefreshing, setIsModalRefreshing] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);
  const [provider, setProvider] = useState("openai");

  // Computed values
  const fieldCardBase =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm";
  const fieldCardFull = `${fieldCardBase} sm:col-span-2 lg:col-span-3`;

  const aiDescriptionDisplayText = useMemo(() => {
    const text = (formManager.forms.create?.ai_description ?? "").trim();
    if (text) return text;
    if (!aiModels.lastScrapeModel) return "";
    const label = aiModels.lastScrapeModel.label || "the selected AI model";
    return `No AI description was returned by ${label}.`;
  }, [formManager.forms.create?.ai_description, aiModels.lastScrapeModel]);

  // ============ HANDLERS ============
  // Open edit modal
  const openEditModal = useCallback(
    (rawCompany) => {
      if (!rawCompany) return;
      formManager.loadFormData("edit", rawCompany);
      setIsModalRefreshing(false);
      modals.openEdit(rawCompany);
    },
    [formManager, modals]
  );

  // Close create modal
  const closeCreateModal = useCallback(() => {
    modals.closeCreate();
    scrape.setScrapeUrl("");
    aiModels.clearScrapeMeta();
    formManager.resetFormState("create");
  }, [modals, scrape, aiModels, formManager]);

  // Redirect to existing company
  const redirectToExistingCompany = useCallback(
    (existingEntry, reason) => {
      if (!existingEntry) return;
      const rawCompany = existingEntry.rawData ?? existingEntry;
      const fallbackName =
        rawCompany?.website_url ?? existingEntry?.website ?? "this company";
      const displayName =
        (
          rawCompany?.company_name ??
          existingEntry?.name ??
          fallbackName
        )?.trim() || fallbackName;
      const reasonMessage =
        reason === "website"
          ? "A company with that website already exists in the database."
          : "That company name already exists in the database.";

      closeCreateModal();
      openEditModal(rawCompany);
      showToast(
        "info",
        `${reasonMessage} Opening existing record for ${displayName}.`
      );
    },
    [showToast, closeCreateModal, openEditModal]
  );

  // Duplicate detection helper
  const maybeHandleDuplicate = useCallback(
    (companyList, overrides = {}) => {
      if (!modals.modals.create) return false;
      const snapshot = { ...(formManager.forms.create ?? {}), ...overrides };
      const duplicate = detectDuplicateCompany(companyList, {
        name: snapshot.company_name,
        website: snapshot.website_url,
      });
      if (duplicate) {
        redirectToExistingCompany(duplicate.existing, duplicate.reason);
        return true;
      }
      return false;
    },
    [modals.modals.create, formManager.forms.create, redirectToExistingCompany]
  );

  // Close modal
  const closeModal = useCallback(() => {
    modals.closeDetails();
    setIsModalRefreshing(false);
    formManager.resetFormState("edit");
  }, [modals, formManager]);

  // Handle create click
  const handleCreateClick = useCallback(() => {
    modals.openCreate();
    const existing = (formManager.forms.create?.website_url || "").trim();
    scrape.setScrapeUrl(existing);
    aiModels.clearScrapeMeta();

    const targetId = aiModels.selectedModelId || aiModels.getDefaultModelId();
    if (targetId) {
      aiModels.setSelectedModelId(targetId);
      formManager.updateFormField("create", "ai_model_id", targetId);
    } else {
      aiModels.setSelectedModelId("");
      formManager.updateFormField("create", "ai_model_id", "");
    }
  }, [modals, formManager, scrape, aiModels]);

  // Handle edit click
  const handleEditClick = useCallback(() => {
    if (!modals.modals.details) return;
    openEditModal(modals.modals.details);
  }, [modals.modals.details, openEditModal]);

  // Handle edit change
  const handleEditChange = useCallback(
    (field, value) => {
      formManager.updateFormField("edit", field, value);
    },
    [formManager]
  );

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    if (modals.modals.details) {
      formManager.loadFormData("edit", modals.modals.details);
    } else {
      formManager.resetFormState("edit");
    }
    modals.closeEdit();
    setIsModalRefreshing(false);
  }, [modals, formManager]);

  // Handle save edit
  const handleSaveEdit = useCallback(async () => {
    const companyId = modals.modals.details?.company_id;
    if (!companyId) {
      showToast("error", "Cannot save: Company ID is missing");
      return;
    }

    if (!formManager.validateForm("edit")) {
      showToast("error", "Please correct the highlighted fields");
      return;
    }

    try {
      const payload = await companiesHook.updateCompany(
        companyId,
        formManager.forms.edit,
        userName
      );
      formManager.setFormValues("edit", payload);
      modals.updateDetails(payload);
      modals.closeEdit();
      formManager.clearFormErrors("edit");
      showToast("success", "Company updated successfully!");
    } catch (error) {
      showToast("error", `Failed to update company: ${error.message}`);
    }
  }, [modals, formManager, companiesHook, userName, showToast]);

  // Handle new company change
  const handleNewCompanyChange = useCallback(
    (field, value) => {
      formManager.updateFormField("create", field, value);
    },
    [formManager]
  );

  // Handle model select
  const handleModelSelect = useCallback(
    (value) => {
      const result = aiModels.handleModelSelect(value);
      formManager.updateFormField("create", "ai_model_id", result);
    },
    [aiModels, formManager]
  );

  // Apply scraped data to form
  const applyScrape = useCallback(
    (scraped, normalizedUrl, meta = null) => {
      const effectiveMeta = (() => {
        if (meta?.modelId) return meta;
        if (aiModels.selectedModelId) {
          const fallbackModel = aiModels.availableModels.find(
            (model) => model.id === aiModels.selectedModelId
          );
          return {
            modelId: aiModels.selectedModelId,
            provider: fallbackModel?.provider || meta?.provider,
            label: fallbackModel?.label || meta?.label,
          };
        }
        return null;
      })();

      if (modals.modals.create) {
        aiModels.setLastScrapeMeta(
          effectiveMeta
            ? {
                ...effectiveMeta,
                label:
                  effectiveMeta.label ||
                  aiModels.availableModels.find(
                    (model) => model.id === effectiveMeta.modelId
                  )?.label ||
                  effectiveMeta.modelId,
              }
            : null
        );
      } else if (aiModels.lastScrapeMeta) {
        aiModels.setLastScrapeMeta(null);
      }

      const next = {
        company_name: scraped.company_name ?? "",
        street_address: scraped.street_address ?? "",
        city: scraped.city ?? "",
        state: scraped.state ?? "",
        postal_code: scraped.postal_code ?? "",
        email_address: scraped.email_address ?? "",
        phone_number: scraped.phone_number ?? "",
        website_url: scraped.website_url ?? normalizedUrl ?? "",
        note_text: scraped.notes ?? "",
        ai_description: scraped.ai_description ?? "",
      };

      if (modals.modals.create) {
        Object.entries(next).forEach(([field, value]) => {
          formManager.updateFormField("create", field, value);
        });
        showToast("success", "Company data scraped successfully!");
        return;
      }

      // Edit mode
      Object.entries(next).forEach(([field, value]) => {
        formManager.updateFormField("edit", field, value);
      });
      modals.updateDetails(next);
      modals.setEditMode(true);
      showToast("success", "Company data scraped successfully!");
    },
    [modals, aiModels, formManager, showToast]
  );

  // Handle create company
  const handleCreateCompany = useCallback(async () => {
    if (companiesHook.creating) return;

    const name = (formManager.forms.create?.company_name ?? "").trim();
    if (!name) {
      showToast("error", "Company name is required");
      return;
    }

    // Refresh company list first
    let companyList = companiesHook.companies;
    try {
      companyList = await companiesHook.refresh();
    } catch {}

    if (maybeHandleDuplicate(companyList, { company_name: name })) {
      return;
    }

    if (!formManager.validateForm("create")) {
      showToast("error", "Please correct the highlighted fields");
      return;
    }

    const payload = { ...formManager.forms.create, company_name: name };

    if (maybeHandleDuplicate(companyList, payload)) {
      return;
    }

    try {
      await companiesHook.createCompany(payload, name);
      closeCreateModal();
      showToast("success", "Company created successfully!");
    } catch (error) {
      showToast("error", `Failed to create company: ${error.message}`);
    }
  }, [
    companiesHook,
    formManager,
    maybeHandleDuplicate,
    closeCreateModal,
    userName,
    showToast,
  ]);

  // Submit scrape
  const submitScrape = useCallback(async () => {
    const result = await scrape.submitScrape(companiesHook.companies, true);
    if (!result) return;

    if (result.duplicate) {
      redirectToExistingCompany(result.duplicate, result.reason);
      return;
    }

    if (result.success && result.data) {
      applyScrape(result.data, result.normalizedUrl, result.meta);
    }
  }, [scrape, companiesHook.companies, redirectToExistingCompany, applyScrape]);

  // Handle edit modal refresh
  const handleEditModalRefresh = useCallback(async () => {
    if (!modals.modals.details || isModalRefreshing) return;

    const mapKeyRaw =
      modals.modals.details?.company_id ?? modals.modals.details?._id ?? "";
    const mapKey = mapKeyRaw ? String(mapKeyRaw) : null;

    const setBlocked = (message) => {
      if (!mapKey) return;
      refreshAll.setRobotsBlockedMap((prev) => ({
        ...prev,
        [mapKey]: message || "Blocked by robots.txt",
      }));
    };

    const clearBlocked = () => {
      if (!mapKey) return;
      refreshAll.setRobotsBlockedMap((prev) => {
        if (!prev[mapKey]) return prev;
        const next = { ...prev };
        delete next[mapKey];
        return next;
      });
    };

    const rawUrl =
      formManager.forms.edit?.website_url ??
      modals.modals.details?.website_url ??
      "";
    const trimmed = (rawUrl || "").trim();

    if (!trimmed) {
      formManager.markFieldTouched("edit", "website_url", true);
      formManager.updateFormField("edit", "website_url", rawUrl, {
        forceValidate: true,
        customError: "Add a website URL before refreshing.",
      });
      showToast("info", "Add a website URL before refreshing this company.");
      return;
    }

    const normalized = normalizeWebsite(trimmed);
    if (!normalized) {
      formManager.markFieldTouched("edit", "website_url", true);
      formManager.updateFormField("edit", "website_url", rawUrl, {
        forceValidate: true,
        customError: "Enter a valid website URL before refreshing.",
      });
      showToast("error", "Please enter a valid website URL before refreshing.");
      return;
    }

    setIsModalRefreshing(true);
    const result = await scrape.scrapeForRefresh(trimmed);
    setIsModalRefreshing(false);

    if (result.blocked) {
      setBlocked(result.message);
      showToast("info", "Refresh blocked by robots.txt for this company.");
      return;
    }

    if (result.error) {
      showToast("error", `Refresh failed: ${result.error}`);
      return;
    }

    if (!result.data) {
      showToast("info", "Refresh complete, but no new data was returned.");
      clearBlocked();
      return;
    }

    applyScrape(result.data, result.normalizedUrl, result.meta);
    clearBlocked();
    showToast("success", "Company data refreshed.");
  }, [
    modals.modals.details,
    isModalRefreshing,
    formManager,
    scrape,
    refreshAll,
    showToast,
    applyScrape,
  ]);

  // Mass delete handlers
  const handleMassDeleteClick = useCallback(() => {
    if (!rowSelection.hasSelection || companiesHook.deletingMany) return;
    setBulkDeleteCount(rowSelection.selectedCount);
    modals.openDeleteMany();
  }, [rowSelection, companiesHook.deletingMany, modals]);

  const cancelDeleteMany = useCallback(() => {
    setBulkDeleteCount(0);
    modals.closeDeleteMany();
  }, [modals]);

  const confirmDeleteMany = useCallback(async () => {
    const ids = Array.from(rowSelection.selectedRows);
    if (!ids.length) {
      modals.closeDeleteMany();
      return;
    }

    await companiesHook.deleteMany(ids);
    modals.closeDeleteMany();
    rowSelection.clearSelection();
    setBulkDeleteCount(0);
  }, [rowSelection, companiesHook, modals]);

  // Refresh many handlers
  const confirmRefreshMany = useCallback(async () => {
    modals.closeRefreshMany();
    await refreshAll.runRefreshAll(companiesHook.companies);
  }, [modals, refreshAll, companiesHook.companies]);

  const cancelRefreshMany = useCallback(() => {
    modals.closeRefreshMany();
  }, [modals]);

  // Row click handler
  const handleRowClick = useCallback(
    (event, company) => {
      if (event.target.closest("a, button, input, textarea, select")) return;
      modals.openDetails(company.rawData);
    },
    [modals]
  );

  // Build detail title
  const detailTitle = modals.modals.details ? (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {modals.modals.details?.website_url ? (
          <a
            className={tbl.title}
            href={getSecureUrl(modals.modals.details.website_url)}
            target="_blank"
            rel="noreferrer"
          >
            {modals.modals.details?.company_name || "Company"}
          </a>
        ) : (
          <span>{modals.modals.details?.company_name || "Company"}</span>
        )}
      </div>
    </div>
  ) : (
    "Company"
  );

  // Field props for create form
  const createWebsiteFieldProps = formManager.getFieldUIProps(
    "create",
    "website_url"
  );
  const createPhoneFieldProps = formManager.getFieldUIProps(
    "create",
    "phone_number"
  );
  const createEmailFieldProps = formManager.getFieldUIProps(
    "create",
    "email_address"
  );
  const createCityFieldProps = formManager.getFieldUIProps("create", "city");
  const createStateFieldProps = formManager.getFieldUIProps("create", "state");
  const createPostalFieldProps = formManager.getFieldUIProps(
    "create",
    "postal_code"
  );

  // ============ RENDER ============

  return (
    <div className={layout.page}>
      <div className={layout.container}>
        <DashboardHeader
          user={user}
          isSignedIn={isSignedIn}
          companies={companiesHook.companies}
          setToasts={setToasts}
          refreshing={refreshAll.refreshing}
        />

        <div className={layout.content}>
          <div className="flex w-full flex-wrap items-end justify-between gap-3 mb-1.5">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={clearSearch}
            />
            <div className="flex-shrink-0">
              <DirectoryScraper
                startPolling={directoryScraper.startPolling}
                isDirectoryScraping={directoryScraper.isDirectoryScraping}
                setIsDirectoryScraping={directoryScraper.setIsDirectoryScraping}
                cancelDirectoryScrape={directoryScraper.cancelDirectoryScrape}
                loading={directoryScraper.scraperLoading}
                setLoading={directoryScraper.setScraperLoading}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <RefreshAI
              provider={provider}
              onProviderChange={setProvider}
              onRefreshWebsiteData={() => modals.openRefreshMany()}
              disabled={companiesHook.loading || refreshAll.refreshing}
              form={formManager.forms}
              updateFormField={formManager.updateFormField}
              validateForm={formManager.validateForm}
              availableModels={aiModels.availableModels}
              selectedModelId={aiModels.selectedModelId}
              handleModelSelect={handleModelSelect}
              isLoadingModels={aiModels.isLoadingModels}
              hasReadyModels={aiModels.hasReadyModels}
              hasEntries={companiesHook.companies.length > 0}
            />
            <button
              className={btn.danger + " !px-5"}
              type="button"
              onClick={handleMassDeleteClick}
              disabled={
                !rowSelection.hasSelection ||
                companiesHook.deletingMany ||
                refreshAll.refreshing
              }
            >
              {companiesHook.deletingMany
                ? "Deleting..."
                : rowSelection.hasSelection
                ? `Delete Selected (${rowSelection.selectedCount})`
                : "Delete Selected"}
            </button>
          </div>

          {companiesHook.loading ? (
            <p className="text-sm text-zinc-200">Loading companies...</p>
          ) : companiesHook.totalCount === 0 ? (
            <p className="text-sm text-zinc-200">No companies found.</p>
          ) : filteredCount === 0 ? (
            <p className="text-sm text-zinc-200">
              {hasSearchQuery
                ? `No companies match "${displaySearchQuery}".`
                : "No companies found."}
            </p>
          ) : null}

          {!companiesHook.loading &&
            companiesHook.totalCount > 0 &&
            filteredCount > 0 && (
              <CompanyTable
                companies={filteredCompanies}
                selectedRows={rowSelection.selectedRows}
                robotsBlockedMap={refreshAll.robotsBlockedMap}
                isSelectAllChecked={rowSelection.isSelectAllChecked}
                selectAllCheckboxRef={rowSelection.selectAllCheckboxRef}
                onSelectAllChange={rowSelection.handleSelectAllChange}
                onRowCheckboxChange={rowSelection.handleRowCheckboxChange}
                onRowClick={handleRowClick}
              />
            )}

          <div className={layout.stats}>
            Total companies in database: {companiesHook.totalCount}{" "}
            {companiesHook.loading && "(loading...)"}{" "}
            {companiesHook.error && (
              <span className={layout.error}> — {companiesHook.error}</span>
            )}
            {refreshAll.refreshing && refreshAll.refreshProgress ? (
              <span className="ml-2 text-sm text-indigo-200">
                • Refreshing {refreshAll.refreshProgress.current}/
                {refreshAll.refreshProgress.total}
              </span>
            ) : null}
            {hasSearchQuery &&
            !companiesHook.loading &&
            companiesHook.totalCount > 0 ? (
              <span className="ml-2 text-sm text-indigo-200">
                • Showing {filteredCount}/{companiesHook.totalCount}
              </span>
            ) : null}
            {rowSelection.hasSelection && !companiesHook.loading && (
              <span className="ml-2 text-sm text-indigo-200">
                • Selected: {rowSelection.selectedCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {toastStack({ toasts })}

      {/* Modal for confirming bulk deletion */}
      <BulkDelete
        open={modals.modals.deleteMany}
        count={bulkDeleteCount || rowSelection.selectedCount}
        deleting={companiesHook.deletingMany}
        onConfirm={confirmDeleteMany}
        onCancel={cancelDeleteMany}
      />

      {/* Modal for confirming bulk refresh */}
      <RefreshCheck
        open={modals.modals.refreshMany}
        count={
          companiesHook.companies.filter((c) => {
            const url = c.rawData?.website_url || c.website;
            return url?.trim();
          }).length
        }
        refreshing={refreshAll.refreshing}
        onConfirm={confirmRefreshMany}
        onCancel={cancelRefreshMany}
      />

      {/* Modal showing summary of bulk refresh */}
      <RefreshSummary
        summary={refreshAll.refreshSummary}
        onClose={refreshAll.clearRefreshSummary}
      />

      {/* Modal for viewing and editing company details */}
      <CompanyDetails
        open={!!modals.modals.details}
        title={detailTitle}
        company={modals.modals.details}
        modals={modals.modals}
        requests={{
          loading: companiesHook.loading,
          saving: companiesHook.saving,
          creating: companiesHook.creating,
          deletingMany: companiesHook.deletingMany,
          refreshing: refreshAll.refreshing,
          error: companiesHook.error,
        }}
        isModalRefreshing={isModalRefreshing}
        forms={formManager.forms}
        formErrors={formManager.formErrors}
        formTouched={formManager.formTouched}
        getFieldUIProps={formManager.getFieldUIProps}
        viewFields={viewFields}
        onClose={closeModal}
        onStartEdit={handleEditClick}
        onCancelEdit={handleCancelEdit}
        onSaveEdit={handleSaveEdit}
        onEditChange={handleEditChange}
        handleModelSelect={handleModelSelect}
        selectedModelId={aiModels.selectedModelId}
        availableModels={aiModels.availableModels}
        isLoadingModels={aiModels.isLoadingModels}
        isAIScraping={scrape.isAIScraping}
        submitRefresh={handleEditModalRefresh}
      />

      {/* Modal for creating a new company */}
      <CreateCompany
        open={modals.modals.create}
        onClose={closeCreateModal}
        onCreate={handleCreateCompany}
        scrapeUrl={scrape.scrapeUrl}
        setScrapeUrl={scrape.setScrapeUrl}
        isAIScraping={scrape.isAIScraping}
        submitScrape={submitScrape}
        selectedModelId={aiModels.selectedModelId}
        availableModels={aiModels.availableModels}
        isLoadingModels={aiModels.isLoadingModels}
        handleModelSelect={handleModelSelect}
        aiDescriptionDisplayText={aiDescriptionDisplayText}
        forms={formManager.forms}
        formErrors={formManager.formErrors}
        formTouched={formManager.formTouched}
        handleNewCompanyChange={handleNewCompanyChange}
        getFieldUIProps={formManager.getFieldUIProps}
        viewFields={viewFields}
        createWebsiteFieldProps={createWebsiteFieldProps}
        createPhoneFieldProps={createPhoneFieldProps}
        createEmailFieldProps={createEmailFieldProps}
        createCityFieldProps={createCityFieldProps}
        createStateFieldProps={createStateFieldProps}
        createPostalFieldProps={createPostalFieldProps}
        fieldCardBase={fieldCardBase}
        fieldCardFull={fieldCardFull}
        form={form}
        modalStyles={modalStyles}
        userName={userName}
      />

      {/* Floating button to create a new company */}
      <button className={layout.plusButton} onClick={handleCreateClick}>
        +
      </button>
    </div>
  );
}
