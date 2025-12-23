import { useState, useCallback } from "react";
import { API } from "../functions/definitions";
import { normalizeWebsite, buildPayload } from "../functions/formutilities";
import { apiFetch, fetchCompanies } from "../functions/api";

export default function useRefreshAll(onCompaniesUpdate, showToast, actorName) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(null);
  const [robotsBlockedMap, setRobotsBlockedMap] = useState({});
  const [refreshSummary, setRefreshSummary] = useState(null);

  const clearRefreshSummary = useCallback(() => {
    setRefreshSummary(null);
  }, []);

  const runRefreshAll = useCallback(
    async (companies) => {
      if (refreshing) return;

      const companiesWithWebsites = companies.filter((company) => {
        const url = company.rawData?.website_url || company.website || "";
        return url.trim();
      });

      const totalCompanies = companiesWithWebsites.length;

      if (!totalCompanies) {
        showToast?.("info", "No companies with website URLs to refresh.");
        return;
      }

      setRefreshing(true);
      setRefreshProgress({ current: 0, total: totalCompanies });
      setRobotsBlockedMap({});
      setRefreshSummary(null);

      const blocked = [];
      const failures = [];
      const successes = [];

      try {
        for (let idx = 0; idx < totalCompanies; idx += 1) {
          const company = companiesWithWebsites[idx];
          const stringId = String(company._id);
          const existingUrl =
            company.rawData?.website_url || company.website || "";
          const normalizedUrl = normalizeWebsite(existingUrl);
          const displayName =
            company.name ||
            company.rawData?.company_name ||
            existingUrl ||
            `Company #${idx + 1}`;

          if (!normalizedUrl) {
            failures.push({
              id: stringId,
              name: displayName,
              message: "Missing a valid website URL.",
            });
            setRefreshProgress({ current: idx + 1, total: totalCompanies });
            continue;
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
              const entry = {
                id: stringId,
                name: displayName,
                message: message || "Scrape failed.",
              };

              if (lower.includes("robots.txt") || lower.includes("disallow")) {
                blocked.push(entry);
              } else {
                failures.push(entry);
              }
            } else {
              const scraped = data?.data ?? {};
              const scrapedWebsite = scraped.website_url || "";
              const normalizedScrapedWebsite = scrapedWebsite
                ? normalizeWebsite(scrapedWebsite)
                : "";
              const sanitizedWebsite = normalizedScrapedWebsite || normalizedUrl;

              const payload = buildPayload({
                company_name:
                  scraped.company_name ||
                  company.rawData?.company_name ||
                  company.name ||
                  "",
                street_address:
                  scraped.street_address ||
                  company.rawData?.street_address ||
                  "",
                city: scraped.city || company.rawData?.city || "",
                state: scraped.state || company.rawData?.state || "",
                postal_code:
                  scraped.postal_code || company.rawData?.postal_code || "",
                email_address:
                  scraped.email_address || company.rawData?.email_address || "",
                phone_number:
                  scraped.phone_number || company.rawData?.phone_number || "",
                website_url: sanitizedWebsite,
              });

              const scrapedNotes =
                typeof scraped.notes === "string" ? scraped.notes.trim() : "";
              payload.note_text =
                scrapedNotes || company.rawData?.note_text || null;

              const scrapedAIDescription =
                typeof scraped.ai_description === "string"
                  ? scraped.ai_description.trim()
                  : "";
              payload.ai_description =
                scrapedAIDescription || company.rawData?.ai_description || null;
              payload.last_updated_by = actorName;

              const updateRes = await apiFetch(`${API}/company/${company._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              if (!updateRes.ok) {
                const errorText = await updateRes.text().catch(() => "");
                failures.push({
                  id: stringId,
                  name: displayName,
                  message:
                    errorText ||
                    `${updateRes.status} ${updateRes.statusText}` ||
                    "Failed to update company.",
                });
              } else {
                successes.push(stringId);
              }
            }
          } catch (error) {
            const message = error?.message || "Unknown error";
            const lower = message.toLowerCase();
            const entry = { id: stringId, name: displayName, message };

            if (lower.includes("robots.txt") || lower.includes("disallow")) {
              blocked.push(entry);
            } else {
              failures.push(entry);
            }
          } finally {
            setRefreshProgress({ current: idx + 1, total: totalCompanies });
          }
        }

        // Refresh companies list
        try {
          const refreshedCompanies = await fetchCompanies();
          onCompaniesUpdate?.(refreshedCompanies);
        } catch (error) {
          showToast?.(
            "error",
            `Companies updated but list refresh failed: ${error.message}`
          );
        }

        // Update blocked map
        const blockedMap = blocked.reduce((acc, entry) => {
          acc[entry.id] = entry.message;
          return acc;
        }, {});
        setRobotsBlockedMap(blockedMap);

        // Show toasts
        const successCount = successes.length;
        const blockedCount = blocked.length;
        const failureCount = failures.length;

        if (successCount) {
          showToast?.(
            "success",
            `Updated ${successCount} compan${successCount === 1 ? "y" : "ies"}`
          );
        }
        if (blockedCount) {
          showToast?.(
            "info",
            `${blockedCount} compan${
              blockedCount === 1 ? "y" : "ies"
            } skipped due to robots.txt`
          );
        }
        if (failureCount) {
          showToast?.(
            "error",
            `${failureCount} compan${
              failureCount === 1 ? "y" : "ies"
            } failed to refresh`
          );
        }

        // Set summary if there were issues
        if (blockedCount || failureCount) {
          setRefreshSummary({
            total: totalCompanies,
            successCount,
            blockedCount,
            failureCount,
            blocked,
            failures,
          });
        } else {
          setRefreshSummary(null);
        }
      } finally {
        setRefreshProgress(null);
        setRefreshing(false);
      }
    },
    [refreshing, onCompaniesUpdate, showToast, actorName]
  );

  return {
    refreshing,
    refreshProgress,
    robotsBlockedMap,
    setRobotsBlockedMap,
    refreshSummary,
    setRefreshSummary,
    clearRefreshSummary,
    runRefreshAll,
  };
}