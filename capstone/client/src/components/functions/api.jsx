import { API } from "./definitions";
import { showToast } from "./ui";

// Wrapper for fetch to include API key header if available; used for all API calls to authenticate
export async function apiFetch(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

// Function to fetch stored companies from given API endpoint
export async function fetchCompanies(signal) {
  const res = await apiFetch(`${API}/company`, { signal });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return normalizeCompanies(await res.json());
}

// Function to normalize fetched company data
export function normalizeCompanies(data) {
  return (Array.isArray(data) ? data : []).map((company, idx) => {
    // Address builder, builds address from available fields
    const streetCity = [company.street_address, company.city]
      .filter(Boolean)
      .join(" ");
    const stateZip = [company.state, company.postal_code]
      .filter(Boolean)
      .join(" ");

    const address = [streetCity, stateZip].filter(Boolean).join(", ");

    return {
      _id: company.company_id || `row-${idx}`,
      name: company.company_name || "",
      address,
      website: company.website_url || "",
      email: company.email_address || "",
      phone: company.phone_number || "",
      rawData: { ...company, address },
    };
  });
}

// Function to download company database as CSV file
export function downloadCSV(companies, setToasts) {
  if (companies.length === 0) {
    showToast(setToasts, "error", "No companies to download.");
    return;
  }

  const headers = [
    "Company Name",
    "Street Address",
    "City",
    "State",
    "Postal Code",
    "Email Address",
    "Phone Number",
    "Website URL",
    "AI Description",
    "Notes",
    "Last Updated By",
    "Last Updated DateTime",
  ];

  const rows = companies.map((c) => [
    c.rawData.company_name || "",
    c.rawData.street_address || "",
    c.rawData.city || "",
    c.rawData.state || "",
    c.rawData.postal_code || "",
    c.rawData.email_address || "",
    c.rawData.phone_number || "",
    c.rawData.website_url || "",
    c.rawData.ai_description || "",
    c.rawData.note_text || "",
    c.rawData.last_updated_by || "",
    c.rawData.last_updated_datetime || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `companies_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}