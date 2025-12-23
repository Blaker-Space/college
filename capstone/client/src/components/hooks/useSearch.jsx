import { useState, useMemo } from "react";

export default function useSearch(companies) {
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const displaySearchQuery = searchQuery.trim();
  const hasSearchQuery = Boolean(displaySearchQuery);

  const filteredCompanies = useMemo(() => {
    if (!normalizedSearchQuery) return companies;

    return companies.filter((company) => {
      const values = [
        company.name,
        company.address,
        company.website,
        company.email,
        company.phone,
      ];

      if (company.rawData) {
        Object.values(company.rawData).forEach((value) => {
          if (typeof value === "string") values.push(value);
        });
      }

      return values.some((value) => {
        if (typeof value !== "string") return false;
        return value.toLowerCase().includes(normalizedSearchQuery);
      });
    });
  }, [companies, normalizedSearchQuery]);

  const filteredCount = filteredCompanies.length;

  const clearSearch = () => setSearchQuery("");

  return {
    searchQuery,
    setSearchQuery,
    displaySearchQuery,
    hasSearchQuery,
    filteredCompanies,
    filteredCount,
    clearSearch,
  };
}