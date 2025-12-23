import { useState, useCallback, useEffect } from "react";
import { API } from "../functions/definitions";
import {
  normalizeWebsite,
  canonicalizeUrl,
  detectDuplicateCompany,
} from "../functions/formutilities";
import { apiFetch, fetchCompanies } from "../functions/api";

export default function useScrape({
  showToast,
  availableModels,
  selectedModelId,
  isLoadingModels,
  setLastScrapeMeta,
  onCompaniesUpdate,
}) {
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [isAIScraping, setIsAIScraping] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("isAIScraping", isAIScraping ? "true" : "false");
  }, [isAIScraping]);

  // Submit a scrape request (for create modal)
  const submitScrape = useCallback(
    async (companies, isCreateModal = true) => {
      const raw = (scrapeUrl || "").trim();
      if (!raw) {
        showToast?.("error", "Please enter a URL");
        return null;
      }

      if (isLoadingModels) {
        showToast?.(
          "info",
          "AI models are still loading. Please wait a moment."
        );
        return null;
      }

      if (!selectedModelId) {
        showToast?.("error", "Select an AI model before scraping");
        return null;
      }

      const normalizedUrl = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

      try {
        new URL(normalizedUrl);
      } catch {
        showToast?.("error", "Please enter a valid URL");
        return null;
      }

      try {
        const candidateCanonicalUrl = canonicalizeUrl(normalizedUrl);

        if (isCreateModal && candidateCanonicalUrl) {
          let companyListForCheck = companies;
          try {
            const refreshed = await fetchCompanies();
            companyListForCheck = refreshed;
            onCompaniesUpdate?.(refreshed);
          } catch (refreshError) {
            console.error(
              "Failed to refresh companies before scrape",
              refreshError
            );
          }

          const existingCompany = (companyListForCheck || []).find((company) => {
            const existingCanonical = canonicalizeUrl(
              company?.rawData?.website_url || company?.website
            );
            return existingCanonical && existingCanonical === candidateCanonicalUrl;
          });

          if (existingCompany) {
            return { duplicate: existingCompany, reason: "website" };
          }
        }

        setIsAIScraping(true);
        localStorage.setItem("isAIScraping", "true");

        const res = await apiFetch(`${API}/scrape`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: normalizedUrl, modelId: selectedModelId }),
        });

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }

        if (!res.ok || data?.success === false) {
          const msg =
            data?.error || data?.message || `${res.status} ${res.statusText}`;
          showToast?.("error", `Scrape failed: ${msg}`);
          setScrapeUrl("");
          setIsAIScraping(false);
          localStorage.setItem("isAIScraping", "false");
          return null;
        }

        // Success
        setScrapeUrl("");
        setIsAIScraping(false);
        localStorage.setItem("isAIScraping", "false");

        if (data?.data) {
          return {
            success: true,
            data: data.data,
            normalizedUrl,
            meta: data.meta ?? null,
          };
        }

        showToast?.("success", data?.message || "Scrape request submitted");
        return { success: true, data: null };
      } catch (e) {
        showToast?.("error", `Scrape failed: ${e.message}`);
        setIsAIScraping(false);
        localStorage.setItem("isAIScraping", "false");
        return null;
      }
    },
    [
      scrapeUrl,
      isLoadingModels,
      selectedModelId,
      showToast,
      onCompaniesUpdate,
    ]
  );

  // Scrape for edit modal refresh (simpler, no duplicate check)
  const scrapeForRefresh = useCallback(
    async (url) => {
      const trimmed = (url || "").trim();
      if (!trimmed) {
        return { error: "Add a website URL before refreshing." };
      }

      const normalizedUrl = normalizeWebsite(trimmed);
      if (!normalizedUrl) {
        return { error: "Enter a valid website URL before refreshing." };
      }

      try {
        const response = await apiFetch(`${API}/scrape`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: normalizedUrl }),
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { success: false, error: text };
        }

        if (!response.ok || data?.success === false) {
          const message =
            data?.error ||
            data?.message ||
            `${response.status} ${response.statusText}`;
          const lower = (message || "").toLowerCase();

          if (lower.includes("robots.txt") || lower.includes("disallow")) {
            return { blocked: true, message };
          }
          return { error: message };
        }

        return {
          success: true,
          data: data?.data,
          normalizedUrl,
          meta: data.meta ?? null,
        };
      } catch (error) {
        const message = error?.message || "Unknown error";
        const lower = message.toLowerCase();

        if (lower.includes("robots.txt") || lower.includes("disallow")) {
          return { blocked: true, message };
        }
        return { error: message };
      }
    },
    []
  );

  // Check for duplicate company
  const checkDuplicate = useCallback((companies, { name, website }) => {
    return detectDuplicateCompany(companies, { name, website });
  }, []);

  return {
    scrapeUrl,
    setScrapeUrl,
    isAIScraping,
    setIsAIScraping,
    submitScrape,
    scrapeForRefresh,
    checkDuplicate,
  };
}