import { useState, useEffect, useCallback } from "react";
import { apiFetch, fetchCompanies } from "../functions/api";

const POLL_INTERVAL = 1500;

export default function useDirectoryScraper(onCompaniesUpdate) {
  const [isDirectoryScraping, setIsDirectoryScraping] = useState(() => {
    return localStorage.getItem("isDirectoryScraping") === "true";
  });
  const [scraperLoading, setScraperLoading] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(
      "isDirectoryScraping",
      isDirectoryScraping ? "true" : "false"
    );
  }, [isDirectoryScraping]);

  // Restore state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("isDirectoryScraping");
    if (stored === "true") {
      setIsDirectoryScraping(true);
    }
  }, []);

  // Polling effect
  useEffect(() => {
    if (!isDirectoryScraping) return;

    const interval = setInterval(async () => {
      try {
        const res = await apiFetch("http://localhost:5000/directory/status");

        if (!res.ok) {
          // Try to refresh companies anyway
          try {
            const updated = await fetchCompanies();
            onCompaniesUpdate?.(updated);
          } catch {}
          return;
        }

        const data = await res.json();

        // Always refresh table on every poll tick
        try {
          const updated = await fetchCompanies();
          onCompaniesUpdate?.(updated);
        } catch (err) {
          console.error("Failed to refresh companies during polling:", err);
        }

        // Stop scraping if not running
        if (data.running === false) {
          setIsDirectoryScraping(false);
          setScraperLoading(false);
          localStorage.setItem("isDirectoryScraping", "false");

          // Final refresh
          try {
            const finalList = await fetchCompanies();
            onCompaniesUpdate?.(finalList);
          } catch {}
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isDirectoryScraping, onCompaniesUpdate]);

  const startPolling = useCallback(() => {
    setIsDirectoryScraping(true);
    localStorage.setItem("isDirectoryScraping", "true");
  }, []);

  const cancelDirectoryScrape = useCallback(async () => {
    try {
      await apiFetch("http://localhost:5000/directory/cancel", { method: "POST" });
    } catch {}

    setIsDirectoryScraping(false);
    localStorage.setItem("isDirectoryScraping", "false");
    setScraperLoading(false);
  }, []);

  return {
    isDirectoryScraping,
    setIsDirectoryScraping,
    scraperLoading,
    setScraperLoading,
    startPolling,
    cancelDirectoryScrape,
  };
}