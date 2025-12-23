-- 01-schema.sql: Run this script to create the database and all necessary tables

-- create the db
CREATE DATABASE webcrawler_db;

-- the main table for our entire schema (central table)
CREATE TABLE IF NOT EXISTS COMPANIES (
    COMPANY_ID SERIAL PRIMARY KEY, -- Unique identifier for each company
    COMPANY_NAME VARCHAR(255) NOT NULL, -- just the name of the company
    ADDED_DATETIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- when the company was first added to the database
    LAST_UPDATED_DATETIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- the last time either a person or the crawler has checked this company for updated data
    LAST_UPDATED_BY VARCHAR(100) DEFAULT 'System', -- who last updated this company record (person name or just "system")
    AI_DESCRIPTION TEXT DEFAULT NULL, -- AI-generated description of the company
    WEBSITE_URL VARCHAR(255) DEFAULT NULL -- the company website url
);

-- a dimension table for company notes
CREATE TABLE IF NOT EXISTS COMPANY_NOTES (
    NOTE_ID SERIAL PRIMARY KEY, -- Unique identifier for each note record
    FK_COMPANY_ID INTEGER NOT NULL REFERENCES COMPANIES(COMPANY_ID) ON DELETE CASCADE ON UPDATE CASCADE, -- Foreign key to allow mapping back to the main company table
    NOTE_TEXT TEXT -- the note text itself
);

-- a dimension table for company contact emails
CREATE TABLE IF NOT EXISTS COMPANY_EMAILS (
    EMAIL_ID SERIAL PRIMARY KEY, -- Unique identifier for each email record
    FK_COMPANY_ID INTEGER NOT NULL REFERENCES COMPANIES(COMPANY_ID) ON DELETE CASCADE ON UPDATE CASCADE, -- Foreign key to allow mapping back to the main company table
    EMAIL_ADDRESS VARCHAR(255) NOT NULL CHECK (EMAIL_ADDRESS <> '') -- the email address itself
);

-- a dimension table for company phone numbers
CREATE TABLE IF NOT EXISTS COMPANY_PHONES (
    PHONE_ID SERIAL PRIMARY KEY, -- Unique identifier for each phone record
    FK_COMPANY_ID INTEGER NOT NULL REFERENCES COMPANIES(COMPANY_ID) ON DELETE CASCADE ON UPDATE CASCADE, -- Foreign key to allow mapping back to the main company table
    PHONE_NUMBER VARCHAR(255) NOT NULL CHECK (PHONE_NUMBER <> '') -- the phone number itself
);

-- a dimension table for company addresses
CREATE TABLE IF NOT EXISTS COMPANY_ADDRESSES (
    ADDRESS_ID SERIAL PRIMARY KEY, -- Unique identifier for each address record
    FK_COMPANY_ID INTEGER NOT NULL REFERENCES COMPANIES(COMPANY_ID) ON DELETE CASCADE ON UPDATE CASCADE, -- Foreign key to allow mapping back to the main company table
    STREET_ADDRESS VARCHAR(255), -- the street address for the company
    CITY VARCHAR(100), -- the East Texas city the company is located in
    STATE VARCHAR(50) DEFAULT 'Texas', -- the state of the company (most likely Texas. Maybe some Louisiana)
    POSTAL_CODE VARCHAR(20) -- the postal / zip code for the company
);