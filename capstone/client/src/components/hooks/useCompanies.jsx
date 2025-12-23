import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchCompanies, apiFetch } from "../functions/api";
import { API } from "../functions/definitions";
import { buildPayload } from "../functions/formutilities";

export default function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingMany, setDeletingMany] = useState(false);

  // Initial fetch
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCompanies(controller.signal);
        setCompanies(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  // Refresh companies list
  const refresh = useCallback(async () => {
    try {
      const data = await fetchCompanies();
      setCompanies(data);
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  // Update a company
  const updateCompany = useCallback(
    async (companyId, formData, actorName) => {
      if (!companyId) {
        throw new Error("Company ID is missing");
      }

      const payload = buildPayload(formData);
      payload.last_updated_by = actorName;

      setSaving(true);
      try {
        const response = await apiFetch(`${API}/company/${companyId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `${response.status} ${response.statusText}: ${errorText}`
          );
        }

        // Update local state
        setCompanies((prev) =>
          prev.map((company) => {
            if (company._id !== companyId) return company;
            const nextRaw = { ...company.rawData, ...payload };
            return {
              ...company,
              name: nextRaw.company_name || company.name,
              address:
                [
                  nextRaw.street_address,
                  nextRaw.city,
                  nextRaw.state,
                  nextRaw.postal_code,
                ]
                  .filter(Boolean)
                  .join(", ") || company.address,
              website: nextRaw.website_url || company.website,
              email: nextRaw.email_address || company.email,
              phone: nextRaw.phone_number || company.phone,
              rawData: nextRaw,
            };
          })
        );

        return payload;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // Create a company
  const createCompany = useCallback(
    async (formData, actorName) => {
      const payload = buildPayload(formData);
      delete payload.ai_model_id;
      payload.last_updated_by = actorName;

      if (typeof payload.ai_description === "string") {
        const trimmed = payload.ai_description.trim();
        payload.ai_description = trimmed || null;
      }

      setCreating(true);
      try {
        const response = await apiFetch(`${API}/company`, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "");
          throw new Error(
            `${response.status} ${response.statusText}${
              errorText ? `: ${errorText}` : ""
            }`
          );
        }

        // Refresh list after creation
        const list = await fetchCompanies();
        setCompanies(list);

        return payload;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  // Delete multiple companies
  const deleteMany = useCallback(
    async (ids) => {
      if (!ids.length) return { successful: [], failed: [] };

      setDeletingMany(true);
      try {
        const results = await Promise.allSettled(
          ids.map((id) => apiFetch(`${API}/company/${id}`, { method: "DELETE" }))
        );

        const successful = [];
        const failed = [];

        results.forEach((result, index) => {
          const id = ids[index];
          if (result.status === "fulfilled" && result.value.ok) {
            successful.push(id);
          } else {
            const message =
              result.status === "fulfilled"
                ? `${result.value.status} ${result.value.statusText}`
                : result.reason?.message || "Unknown error";
            failed.push({ id, message });
          }
        });

        // Refresh after deletion
        const list = await fetchCompanies();
        setCompanies(list);

        return { successful, failed };
      } finally {
        setDeletingMany(false);
      }
    },
    []
  );

  // Optimistically update a company's AI description (for summarize)
  const updateAIDescription = useCallback((companyId, summary) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.company_id === companyId || c._id === companyId
          ? {
              ...c,
              rawData: { ...(c.rawData || {}), ai_description: summary },
            }
          : c
      )
    );
  }, []);

  // Computed values
  const totalCount = companies.length;

  return {
    companies,
    setCompanies,
    loading,
    error,
    saving,
    creating,
    deletingMany,
    refresh,
    updateCompany,
    createCompany,
    deleteMany,
    updateAIDescription,
    totalCount,
  };
}