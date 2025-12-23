-- 02-indexes.sql: Run this script to create all necessary indexes

-- Indexes for COMPANIES table
CREATE INDEX idx_companies_added_datetime ON COMPANIES(ADDED_DATETIME);
CREATE INDEX idx_companies_last_checked ON COMPANIES(LAST_CHECKED_DATETIME);

-- Indexes for COMPANY_EMAILS table
CREATE INDEX idx_company_emails_address ON COMPANY_EMAILS(EMAIL_ADDRESS);

-- Indexes for COMPANY_PHONES table
CREATE INDEX idx_company_phones_number ON COMPANY_PHONES(PHONE_NUMBER);

-- Indexes for COMPANY_ADDRESSES table
CREATE INDEX idx_company_addresses_postal ON COMPANY_ADDRESSES(POSTAL_CODE);
CREATE INDEX idx_company_addresses_city ON COMPANY_ADDRESSES(CITY);