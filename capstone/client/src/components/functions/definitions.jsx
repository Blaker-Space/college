import { tbl } from "../styles";

// Definitions to standardize fields across components
// List columns (table)
export const listCols = [
  { key: "company_name", label: "Company", columnClass: tbl.compactColumn },
  {
    key: "address",
    label: "Address",
    columnClass: tbl.addressColumn,
  },
  {
    key: "website_url",
    label: "Website",
    columnClass: tbl.websiteColumn,
    render: (v, getUrl) =>
      v ? (
        <a
          className={tbl.link}
          href={getUrl(v)}
          target="_blank"
          rel="noreferrer"
        >
          {v}
        </a>
      ) : (
        "None"
      ),
  },
  {
    key: "email_address",
    label: "Email",
    columnClass: tbl.websiteColumn,
    render: (v) =>
      v ? (
        <a className={tbl.link} href={`mailto:${v}`}>
          {v}
        </a>
      ) : (
        "None"
      ),
  },
  { key: "phone_number", label: "Phone", columnClass: tbl.compactColumn },
];

// For viewing company details
export const viewFields = [
  { key: "company_name", label: "Company Name", type: "text", editable: true },
  {
    key: "street_address",
    label: "Street Address",
    type: "text",
    editable: true,
  },
  { key: "city", label: "City", type: "text", editable: true },
  { key: "state", label: "State", type: "select", editable: true },
  { key: "postal_code", label: "Zip Code", type: "text", editable: true },
  {
    key: "email_address",
    label: "Email Address",
    type: "email",
    editable: true,
  },
  { key: "phone_number", label: "Phone Number", type: "text", editable: true },
  { key: "website_url", label: "Website URL", type: "text", editable: true },
  {
    key: "ai_description",
    label: "AI Description",
    type: "text",
    editable: false,
  },
  { key: "note_text", label: "Notes", type: "textarea", editable: true },
  {
    key: "last_updated_by",
    label: "Last Updated By",
    type: "text",
    editable: false,
  },
];

// For creating companies
export const createFields = [
  {
    key: "company_name",
    label: "Company Name",
    type: "text",
    required: true,
    ph: "Enter company name",
  },
  {
    key: "street_address",
    label: "Street Address",
    type: "text",
    ph: "Enter street address",
  },
  { key: "city", label: "City", type: "text", ph: "Enter city" },
  { key: "state", label: "State", type: "text", ph: "Enter state" },
  { key: "postal_code", label: "Zip Code", type: "text", ph: "Enter zip code" },
  { key: "email_address", label: "Email", type: "email", ph: "Enter email" },
  { key: "phone_number", label: "Phone", type: "text", ph: "Enter phone" },
  { key: "website_url", label: "Website", type: "url", ph: "Enter website" },
  { key: "note_text", label: "Notes", type: "textarea", ph: "Enter notes" },
];

// Character length limits for key company fields
export const FIELD_CHAR_LIMITS = {
  company_name: 200,
  website_url: 200,
  note_text: 1000,
  email_address: 200,
  street_address: 200,
  city: 50,
  state: 50,
};

// Used to statically change API endpoint as needed
export const API = "http://localhost:5000";

// Validation constants
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
export const WEBSITE_REGEX =
  /^(https?:\/\/)?([\w-]+\.)+([a-z]{2,})([\/?#][^\s]*)?$/i;
export const STATE_SUGGESTION_LIMIT = 6;
export const PHONE_DIGIT_LIMIT = 10;

// Fields that require validation on submit
export const VALIDATE_ON_SUBMIT_FIELDS = [
  "website_url",
  "email_address",
  "phone_number",
  "state",
  "postal_code",
];

// List of US states for validation and suggestions
export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];
