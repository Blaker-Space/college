import {
  US_STATES,
  EMAIL_REGEX,
  WEBSITE_REGEX,
  PHONE_DIGIT_LIMIT,
  STATE_SUGGESTION_LIMIT,
} from "./definitions";

// Functions to sanitize and validate form field values
// Main Functions

// Returns value or "None" if empty; used to properly display empty fields
export const valueOrNone = (value) => (value ?? "").toString().trim() || "None";

// Sanitizes field values based on field type
export const sanitizeFieldValue = (field, rawValue) => {
  const stringValue =
    typeof rawValue === "string"
      ? rawValue
      : rawValue == null
      ? ""
      : String(rawValue);

  switch (field) {
    case "phone_number": {
      return formatPhone(stringValue).formatted;
    }
    case "postal_code":
      return normalizeZip(stringValue);
    case "city":
      return formatCityValue(stringValue);
    case "state":
      return normalizeStateCasing(stringValue);
    case "email_address":
    case "website_url":
      return stringValue.trim();
    default:
      return stringValue;
  }
};

// Validates field values and returns error messages if invalid
export const validateFieldValue = (field, rawValue) => {
  const value = typeof rawValue === "string" ? rawValue.trim() : rawValue ?? "";

  // Make company_name required
  if (field === "company_name") {
    return value ? "" : "Company name is required";
  }

  if (!value) return "";

  switch (field) {
    case "website_url":
      if (!WEBSITE_REGEX.test(value)) {
        return "Please enter a valid website URL";
      }
      return normalizeWebsite(value) ? "" : "Please enter a valid website URL";

    case "email_address":
      return EMAIL_REGEX.test(value)
        ? ""
        : "Please enter a valid email address";

    case "phone_number":
      return digitsOnly(value).length === 10
        ? ""
        : "Enter a 10-digit phone number";

    case "postal_code":
      return /^\d{5}$/.test(value) ? "" : "Zip code must be 5 digits";

    case "state": {
      const normalized = value.toLowerCase();
      const matches = US_STATES.some(
        (state) => state.toLowerCase() === normalized
      );
      return matches ? "" : "Select a valid US state";
    }

    default:
      return "";
  }
};

// Provides state suggestions based on user input
export const getStateSuggestions = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) {
    return US_STATES.slice(0, STATE_SUGGESTION_LIMIT);
  }
  const matches = US_STATES.filter((state) =>
    state.toLowerCase().startsWith(trimmed.toLowerCase())
  );
  const source = matches.length ? matches : US_STATES;
  return source.slice(0, STATE_SUGGESTION_LIMIT);
};

// Autocompletes state value based on input
export const autocompleteStateValue = (value = "") => {
  const normalized = normalizeStateCasing(value);
  if (!normalized) return "";
  const match = US_STATES.find((state) =>
    state.toLowerCase().startsWith(normalized.toLowerCase())
  );
  return match || normalized;
};

// Prepares form values for UI display by sanitizing each field
export const prepareFormValuesForUI = (values = {}) => {
  return Object.entries(values).reduce((acc, [field, rawValue]) => {
    let sanitized = sanitizeFieldValue(field, rawValue);
    if (field === "state" && sanitized) {
      sanitized = autocompleteStateValue(sanitized);
    }
    if (field === "website_url" && sanitized) {
      const normalized = normalizeWebsite(sanitized);
      sanitized = normalized ?? sanitized;
    }
    acc[field] = sanitized ?? "";
    return acc;
  }, {});
};

// Builds payload for submission by formatting fields as needed
export const buildPayload = (values = {}) => {
  const next = { ...values };

  if (typeof next.company_name === "string") {
    next.company_name = next.company_name.trim();
  }
  if (typeof next.last_updated_by === "string") {
    next.last_updated_by = next.last_updated_by.trim();
  }
  if (typeof next.email_address === "string") {
    next.email_address = next.email_address.trim();
    if (!next.email_address) {
      next.email_address = null;
    }
  }
  if (typeof next.website_url === "string" && next.website_url) {
    const normalized = normalizeWebsite(next.website_url);
    if (normalized) {
      next.website_url = normalized;
    }
  }
  if (typeof next.state === "string") {
    next.state = autocompleteStateValue(next.state);
  }
  if (typeof next.city === "string") {
    next.city = formatCityValue(next.city);
  }
  if (typeof next.postal_code === "string") {
    next.postal_code = normalizeZip(next.postal_code);
  }
  if (typeof next.phone_number === "string") {
    next.phone_number = formatPhone(next.phone_number).formatted;
    if (!next.phone_number) {
      next.phone_number = null;
    }
  }

  return next;
};

// Grabs field value; chooses between edited data or original data
export const getFieldValue = (edited, original, key) =>
  edited?.[key] ?? original?.[key] ?? "";

// Detects duplicate companies based on name or website
export const detectDuplicateCompany = (list = [], { name, website } = {}) => {
  const matchByWebsite = findExistingCompanyByWebsite(list, website);
  if (matchByWebsite) {
    return { existing: matchByWebsite, reason: "website" };
  }
  const matchByName = findExistingCompanyByName(list, name);
  if (matchByName) {
    return { existing: matchByName, reason: "name" };
  }
  return null;
};

// Function to format date-time strings
export function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day}/${year} ${hours}:${minutes}`;
}

// Function to normalize website URLs
export const normalizeWebsite = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  let withProtocol = trimmed;
  if (!/^https?:\/\//i.test(withProtocol)) {
    withProtocol = `https://${withProtocol}`;
  }
  try {
    const url = new URL(withProtocol);
    url.protocol = "https:";
    const hostWithoutWww = url.hostname.replace(/^www\./i, "");
    url.hostname = `www.${hostWithoutWww}`;
    return url.toString();
  } catch {
    return null;
  }
};

// Function to canonicalize URLs for comparison
export const canonicalizeUrl = (value = "") => {
  const normalized = normalizeWebsite(value);
  if (!normalized) return "";
  try {
    const url = new URL(normalized);
    url.hash = "";
    const href = url.href;
    return href.replace(/\/$/, "").toLowerCase();
  } catch {
    return normalized.replace(/\/$/, "").toLowerCase();
  }
};

// Function to resolve default AI model ID from a list
export const resolveDefaultModelId = (models = []) => {
  if (!models.length) return "";
  const preferred = models.find((model) => model.default);
  return (preferred ?? models[0])?.id ?? "";
};

// Function to get secure URL
export function getSecureUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

// Helper Functions
// Extracts only digits from a given string
export const digitsOnly = (value = "") => (value || "").replace(/\D/g, "");

// Formats a phone number to XXX-XXX-XXXX and returns both formatted and digit-only versions
export const formatPhone = (raw = "") => {
  const digits = digitsOnly(raw).slice(0, PHONE_DIGIT_LIMIT);
  if (digits.length <= 3) return { formatted: digits, digits };
  if (digits.length <= 6)
    return { formatted: `${digits.slice(0, 3)}-${digits.slice(3)}`, digits };
  return {
    formatted: `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`,
    digits,
  };
};

// Normalizes a zip code to the first 5 digits only
export const normalizeZip = (value = "") => digitsOnly(value).slice(0, 5);

// Formats city names to Title Case
export const formatCityValue = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

// Normalizes state names to Title Case
export const normalizeStateCasing = (value = "") => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

// Normalizes company names for comparison
export const normalizeCompanyName = (value = "") => value.trim().toLowerCase();

// Finds existing company by name in a list
export const findExistingCompanyByName = (list = [], candidateName = "") => {
  const target = normalizeCompanyName(candidateName);
  if (!target) return null;
  return (
    list.find((company) => {
      if (!company) return false;
      const source = company.rawData ?? company;
      const existingName = normalizeCompanyName(
        source?.company_name ?? company?.name ?? ""
      );
      return existingName && existingName === target;
    }) ?? null
  );
};

// Finds existing company by website in a list
export const findExistingCompanyByWebsite = (
  list = [],
  candidateWebsite = ""
) => {
  const target = canonicalizeUrl(candidateWebsite);
  if (!target) return null;
  return (
    list.find((company) => {
      if (!company) return false;
      const source = company.rawData ?? company;
      const existingCanonical = canonicalizeUrl(
        source?.website_url ?? company?.website ?? ""
      );
      return existingCanonical && existingCanonical === target;
    }) ?? null
  );
};
