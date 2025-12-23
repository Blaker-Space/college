require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { spawn, exec } = require("child_process");
const pool = require("./db");
const path = require("path");
const fs = require("fs");
const aiModels = require("./ai-models.json");
let activeDirectoryProcess = null;

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;


const authenticateRequest = (req, res, next) => {

  // Check for API key in headers
  const key = req.headers["x-api-key"];
  // Validate API key
  if (key !== API_KEY || !API_KEY) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Invalid or missing API key" });
  }
  next();
};

// Apply authentication middleware to all routes
app.use(authenticateRequest);

// module.exports = router;

//  Summarize All Backend Code
app.post("/api/summarize", (req, res) => {
  const { url, provider } = req.body;

  if (!url) {
    console.warn("[WARN] Missing 'url' in request body.");
    return res.status(400).json({ error: "Missing URL" });
  }

  // Define provider mapping with their default models
  const providerDefaults = {
    openai: { provider: "openai", model: "gpt-4o" },
    gemini: { provider: "gemini", model: "models/gemini-2.0-flash" },
    ollama: { provider: "ollama", model: "llama3.2" },
  };

  // Get the provider config (default to OpenAI if not specified)
  const config =
    providerDefaults[provider?.toLowerCase()] || providerDefaults.openai;

  const scriptPath = path.join(__dirname, "llm_service_cli.py");
  const command = `python "${scriptPath}" --url="${url}" --provider="${config.provider}" --model="${config.model}"`;

  console.log(`[RUN] Executing: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`[ERROR] Python subprocess failed for URL: ${url}`);
      console.error(`[STDERR]: ${stderr}`);
      console.error(`[Message]: ${error.message}`);
      return res.status(500).json({
        error: "Error running summarizer CLI",
        details: error.message,
        stderr: stderr,
      });
    }

    try {
      // Strip logs and find valid JSON in stdout
      const jsonMatch = stdout.match(/{.*}/s);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in subprocess output.");
      }

      const result = JSON.parse(jsonMatch[0]);

      if (result.error) {
        console.warn(`[WARN] Summarizer error for ${url}:`, result.error);
        return res.status(500).json({ error: result.error });
      }

      console.log(`[OK] Summary generated for: ${url}`);
      return res.status(200).json({ summary: result.summary });
    } catch (e) {
      console.error(`[FATAL] Failed to parse JSON for ${url}`);
      console.error(`[Raw Output]: ${stdout}`);
      console.error(`[Parse Error]: ${e.message}`);
      return res.status(500).json({
        error: "Invalid output from summarizer",
        raw: stdout,
        parseError: e.message,
      });
    }
  });
});

const VENV_PY = path.join(__dirname, "..", ".venv", "bin", "python");
const HAS_VENV_PY = fs.existsSync(VENV_PY);
const PYTHON = HAS_VENV_PY ? VENV_PY : process.env.PYTHON || "python3";
const DIRSCRAPE_SCRIPT = path.join(__dirname, "scripts", "directoryScraper.py");
const NODE_BIN = process.env.NODE_BIN || process.execPath;
const SCRAPE_SCRIPT = path.join(__dirname, "scripts", "scrapeURL.mjs");

console.log("[DirectoryScraper] VENV path:", VENV_PY, "exists:", HAS_VENV_PY);
console.log("[DirectoryScraper] Using Python interpreter:", PYTHON);

function isModelReady(model) {
  if (!model) return false;
  return model.envVar ? Boolean(process.env[model.envVar]) : true;
}

function getModelById(modelId) {
  if (!modelId) return null;
  return aiModels.find((model) => model.id === modelId) || null;
}

function getDefaultModelId() {
  const readyModels = aiModels.filter(isModelReady);
  const preferredReady = readyModels.find((model) => model.default);
  if (preferredReady) return preferredReady.id;
  if (readyModels.length) return readyModels[0].id;
  const preferred = aiModels.find((model) => model.default);
  return preferred ? preferred.id : aiModels[0]?.id || null;
}

function sanitizeModelId(modelId) {
  const trimmed = typeof modelId === "string" ? modelId.trim() : "";
  const resolved = getModelById(trimmed);
  if (resolved && isModelReady(resolved)) {
    return resolved.id;
  }
  return getDefaultModelId();
}

const MAX_LAST_UPDATED_BY_LENGTH = 100;

function resolveLastUpdatedBy(rawValue) {
  if (typeof rawValue !== "string") return "";
  const trimmed = rawValue.trim();
  if (!trimmed) return "";
  return trimmed.length > MAX_LAST_UPDATED_BY_LENGTH
    ? trimmed.slice(0, MAX_LAST_UPDATED_BY_LENGTH)
    : trimmed;
}

function defaultLastUpdatedBy(rawValue) {
  const resolved = resolveLastUpdatedBy(rawValue);
  return resolved || "System";
}

async function markCompanyUpdated(companyId, lastUpdatedBy) {
  if (!companyId) return;
  const resolved = resolveLastUpdatedBy(lastUpdatedBy);
  const fields = ["LAST_UPDATED_DATETIME = CURRENT_TIMESTAMP"];
  const values = [];
  let idx = 1;
  if (resolved) {
    fields.push(`LAST_UPDATED_BY = $${idx++}`);
    values.push(resolved);
  }
  const sql = `UPDATE COMPANIES SET ${fields.join(
    ", "
  )} WHERE COMPANY_ID = $${idx}`;
  values.push(companyId);
  await pool.query(sql, values);
}

//Routes

// directoryScrape endpoint
app.post("/directory", (req, res) => {
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: "Missing 'url' in body" });

  const args = [DIRSCRAPE_SCRIPT, url];

  console.log("POST /scrape =>", url);

  if (activeDirectoryProcess) {
    try {
      activeDirectoryProcess.kill("SIGTERM");
    } catch {}
  }

  const p = spawn(PYTHON, args, { stdio: ["ignore", "pipe", "pipe"] });
  activeDirectoryProcess = p;

  let out = "",
    err = "";
  p.stdout.on("data", (d) => (out += d));
  p.stderr.on("data", (d) => (err += d));

  p.on("error", (e) => {
    console.error("Failed to start Python:", e);
    return res
      .status(500)
      .json({ error: "Failed to start Python", details: String(e) });
  });

  p.on("close", (code) => {
    activeDirectoryProcess = null;
    if (err) console.warn("directoryScraper.py stderr:", err.trim());
    if (code !== 0) {
      console.error("directoryScraper.py exited with code", code);
      return res
        .status(500)
        .json({ error: "Script failed", code, stderr: err.trim() });
    }
    try {
      const data = JSON.parse(out.trim());
      return res.json(data);
    } catch (e) {
      console.error("Invalid JSON from directoryScraper.py:", out);
      return res
        .status(500)
        .send("Invalid JSON from directoryScraper.py: " + out);
    }
  });
});

app.get("/directory/status", (req, res) => {
  res.json({ running: Boolean(activeDirectoryProcess) });
});

app.get("/ai-models", (req, res) => {
  const models = aiModels.map((model) => ({
    id: model.id,
    label: model.label,
    provider: model.provider,
    description: model.description || "",
    default: Boolean(model.default),
    ready: isModelReady(model),
  }));
  res.json({ models, defaultModelId: getDefaultModelId() });
});

// Run the OpenAI JS script and return its stdout to the browser
app.get("/scrape", (req, res) => {
  const args = [SCRAPE_JS_SCRIPT];
  const { url } = req.query || {};
  if (url) args.push(url);

  const p = spawn(NODE_BIN, args, { stdio: ["ignore", "pipe", "pipe"] });

  let out = "",
    err = "";
  p.stdout.on("data", (d) => (out += d));
  p.stderr.on("data", (d) => (err += d));

  p.on("error", (e) => {
    console.error("Failed to start Node for scrapeURL.js:", e);
    return res
      .status(500)
      .json({ error: "Failed to start Node", details: String(e) });
  });

  p.on("close", (code) => {
    if (err) console.warn("scrapeURL.js stderr:", err.trim());
    if (code !== 0) {
      console.error("scrapeURL.js exited with code", code);
      return res.status(500).send(err || "Script failed");
    }
    const body = out.trim();
    try {
      return res.json(JSON.parse(body));
    } catch {
      return res.type("text/plain").send(body);
    }
  });
});

app.post("/scrape", (req, res) => {
  const { url, modelId } = req.body || {};
  if (!url) return res.status(400).json({ error: "Missing 'url' in body" });

  const resolvedModelId = sanitizeModelId(modelId);
  const args = [SCRAPE_SCRIPT, url];
  if (resolvedModelId) args.push(resolvedModelId);

  console.log("POST /scrape =>", url, "model:", resolvedModelId);
  const p = spawn(NODE_BIN, args, { stdio: ["ignore", "pipe", "pipe"] });

  let out = "",
    err = "";
  p.stdout.on("data", (d) => {
    const chunk = d.toString();
    console.log("scrapeURL.mjs stdout chunk:", chunk);
    out += d;
  });
  p.stderr.on("data", (d) => {
    const chunk = d.toString();
    console.log("scrapeURL.mjs stderr chunk:", chunk);
    err += d;
  });

  p.on("error", (e) => {
    console.error("Failed to start Node:", e);
    return res
      .status(500)
      .json({ error: "Failed to start Node", details: String(e) });
  });

  p.on("close", (code) => {
    console.log("scrapeURL.mjs exited with code:", code);
    console.log("Full stdout:", out);
    console.log("Full stderr:", err);

    if (err) console.warn("scrapeURL.mjs stderr:", err.trim());
    if (code !== 0) {
      console.error("scrapeURL.mjs exited with code", code);
      return res
        .status(500)
        .json({ error: "Script failed", code, stderr: err.trim() });
    }
    // The script already returns JSON; validate and forward
    try {
      const data = JSON.parse(out.trim());
      console.log("Parsed JSON data:", data);
      console.log("Sending response to client");
      return res.json(data);
    } catch (e) {
      console.error("Invalid JSON from scrapeURL.mjs:", out);
      console.error("Parse error:", e.message);
      return res.status(500).send("Invalid JSON from scrapeURL.mjs: " + out);
    }
  });
});

// Create a new company
app.post("/company", async (req, res) => {
  try {
    const newData = req.body;
    const existing = await pool.query(
      "SELECT COMPANY_ID FROM COMPANIES WHERE LOWER(COMPANY_NAME) = LOWER($1)",
      [newData.company_name]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "Company already exists",
        company_id: existing.rows[0].company_id,
      });
    }
    const lastUpdatedBy = defaultLastUpdatedBy(newData.last_updated_by);
    const aiDescription =
      typeof newData.ai_description === "string"
        ? newData.ai_description.trim() || null
        : null;
    const newCompany = await pool.query(
      "INSERT INTO COMPANIES (COMPANY_NAME, WEBSITE_URL, AI_DESCRIPTION, LAST_UPDATED_BY) VALUES ($1, $2, $3, $4) RETURNING *",
      [newData.company_name, newData.website_url, aiDescription, lastUpdatedBy]
    );
    const companyId = newCompany.rows[0].company_id;
    console.log(companyId);
    // Insert email if provided
    if (newData.email_address) {
      await pool.query(
        "INSERT INTO COMPANY_EMAILS (FK_COMPANY_ID, EMAIL_ADDRESS) VALUES ($1, $2)",
        [companyId, newData.email_address]
      );
      const newEmail = await pool.query(
        "SELECT * FROM COMPANY_EMAILS WHERE FK_COMPANY_ID = $1",
        [companyId]
      );
      console.log(newEmail.rows[0]);
    }

    //Insert user-typed notes if provided
    if (newData.notes) {
      await pool.query(
        "INSERT INTO COMPANY_NOTES (FK_COMPANY_ID, NOTE_TEXT) VALUES ($1, $2)",
        [companyId, newData.notes]
      );
    }

    // Insert phone if provided
    if (newData.phone_number) {
      await pool.query(
        "INSERT INTO COMPANY_PHONES (FK_COMPANY_ID, PHONE_NUMBER) VALUES ($1, $2)",
        [companyId, newData.phone_number]
      );
    }

    // Insert address fields if any provided
    const addressCols = ["FK_COMPANY_ID"];
    const addressPlaceholders = ["$1"];
    const addressValues = [companyId];
    let paramIdx = 2;

    if (newData.street_address) {
      addressCols.push("STREET_ADDRESS");
      addressPlaceholders.push(`$${paramIdx++}`);
      addressValues.push(newData.street_address);
    }
    if (newData.city) {
      addressCols.push("CITY");
      addressPlaceholders.push(`$${paramIdx++}`);
      addressValues.push(newData.city);
    }
    if (newData.state) {
      addressCols.push("STATE");
      addressPlaceholders.push(`$${paramIdx++}`);
      addressValues.push(newData.state);
    }
    if (newData.postal_code) {
      addressCols.push("POSTAL_CODE");
      addressPlaceholders.push(`$${paramIdx++}`);
      addressValues.push(newData.postal_code);
    }

    if (addressCols.length > 1) {
      await pool.query(
        `INSERT INTO COMPANY_ADDRESSES (${addressCols.join(
          ", "
        )}) VALUES (${addressPlaceholders.join(", ")})`,
        addressValues
      );
    }

    if (newData.note_text) {
      await pool.query(
        "INSERT INTO COMPANY_NOTES (FK_COMPANY_ID, NOTE_TEXT) VALUES ($1, $2)",
        [companyId, newData.note_text]
      );
    }

    if (newData.ai_description) {
      await pool.query(
        "UPDATE COMPANIES SET AI_DESCRIPTION = $1 WHERE COMPANY_ID = $2",
        [newData.ai_description, companyId]
      );
    }

    res.json(newCompany.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all companies
app.get("/company", async (req, res) => {
  try {
    const allCompanies = await pool.query(
      "SELECT C.COMPANY_ID, C.COMPANY_NAME, C.ADDED_DATETIME, C.LAST_UPDATED_DATETIME," +
        " C.LAST_UPDATED_BY, C.AI_DESCRIPTION, C.WEBSITE_URL," +
        " CE.EMAIL_ADDRESS, CP.PHONE_NUMBER, CA.STREET_ADDRESS, CA.CITY, CA.STATE, CA.POSTAL_CODE, CN.NOTE_TEXT" +
        " FROM COMPANIES C" +
        " LEFT JOIN COMPANY_EMAILS CE ON C.COMPANY_ID = CE.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_PHONES CP ON C.COMPANY_ID = CP.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_ADDRESSES CA ON C.COMPANY_ID = CA.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_NOTES CN ON C.COMPANY_ID = CN.FK_COMPANY_ID" +
        " ORDER BY C.COMPANY_ID"
    );
    res.json(allCompanies.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a specific company
app.get("/company/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const company = await pool.query(
      "SELECT C.COMPANY_ID, C.COMPANY_NAME, C.ADDED_DATETIME, C.LAST_UPDATED_DATETIME," +
        " C.LAST_UPDATED_BY, C.AI_DESCRIPTION, C.WEBSITE_URL," +
        " CE.EMAIL_ADDRESS, CP.PHONE_NUMBER, CA.STREET_ADDRESS, CA.CITY, CA.STATE, CA.POSTAL_CODE, CN.NOTE_TEXT" +
        " FROM COMPANIES C" +
        " LEFT JOIN COMPANY_EMAILS CE ON C.COMPANY_ID = CE.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_PHONES CP ON C.COMPANY_ID = CP.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_ADDRESSES CA ON C.COMPANY_ID = CA.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_NOTES CN ON C.COMPANY_ID = CN.FK_COMPANY_ID" +
        " WHERE C.COMPANY_ID = $1",
      [id]
    );
    res.json(company.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a company
app.put("/company/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const lastUpdatedBy = defaultLastUpdatedBy(newData.last_updated_by);
    const existingCompany = await pool.query(
      "SELECT C.COMPANY_NAME, C.WEBSITE_URL, C.AI_DESCRIPTION, C.LAST_UPDATED_BY, CE.EMAIL_ADDRESS, CP.PHONE_NUMBER," +
        " CA.STREET_ADDRESS, CA.CITY, CA.STATE, CA.POSTAL_CODE, CN.NOTE_TEXT FROM COMPANIES C" +
        " LEFT JOIN COMPANY_EMAILS CE ON C.COMPANY_ID = CE.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_PHONES CP ON C.COMPANY_ID = CP.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_ADDRESSES CA ON C.COMPANY_ID = CA.FK_COMPANY_ID" +
        " LEFT JOIN COMPANY_NOTES CN ON C.COMPANY_ID = CN.FK_COMPANY_ID" +
        " WHERE C.COMPANY_ID = $1 LIMIT 1",
      [id]
    );

    if (existingCompany.rows.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    // build dynamic UPDATE for COMPANIES so we only set provided columns
    let updateClauses = [];
    let updateValues = [];
    let paramIdx = 1;

    if (
      newData.company_name !== undefined &&
      newData.company_name !== existingCompany.rows[0].company_name
    ) {
      updateClauses.push(`COMPANY_NAME = $${paramIdx++}`);
      updateValues.push(newData.company_name);
    }

    if (
      newData.website_url !== undefined &&
      newData.website_url !== existingCompany.rows[0].website_url
    ) {
      updateClauses.push(`WEBSITE_URL = $${paramIdx++}`);
      updateValues.push(newData.website_url);
    }

    if (newData.ai_description !== undefined) {
      const sanitizedAI =
        typeof newData.ai_description === "string"
          ? newData.ai_description.trim() || null
          : newData.ai_description;
      if (sanitizedAI !== existingCompany.rows[0].ai_description) {
        updateClauses.push(`AI_DESCRIPTION = $${paramIdx++}`);
        updateValues.push(sanitizedAI);
      }
    }

    if (updateClauses.length > 0) {
      updateClauses.push(`LAST_UPDATED_BY = $${paramIdx++}`);
      updateValues.push(lastUpdatedBy);
      updateClauses.push(`LAST_UPDATED_DATETIME = CURRENT_TIMESTAMP`);
      const sql = `UPDATE COMPANIES SET ${updateClauses.join(
        ", "
      )} WHERE COMPANY_ID = $${paramIdx}`;
      updateValues.push(id);
      await pool.query(sql, updateValues);
    }
    // Check and update AI_DESCRIPTION
    if (newData.ai_description !== undefined) {
      await pool.query(
        "UPDATE COMPANIES SET AI_DESCRIPTION = $1, LAST_UPDATED_DATETIME = CURRENT_TIMESTAMP, LAST_UPDATED_BY = $3 WHERE COMPANY_ID = $2",
        [newData.ai_description, id, lastUpdatedBy]
      );
    }

    // Check and update/insert/delete email
    if (newData.email_address !== undefined) {
      const sanitizedEmail =
        typeof newData.email_address === "string"
          ? newData.email_address.trim()
          : newData.email_address;
      const normalizedEmail = sanitizedEmail || null;
      const existingEmail = existingCompany.rows[0].email_address || null;

      if (normalizedEmail) {
        if (normalizedEmail !== existingEmail) {
          const emailExists = await pool.query(
            "SELECT 1 FROM COMPANY_EMAILS WHERE FK_COMPANY_ID = $1",
            [id]
          );
          if (emailExists.rows.length === 0) {
            await pool.query(
              "INSERT INTO COMPANY_EMAILS (FK_COMPANY_ID, EMAIL_ADDRESS) VALUES ($1, $2)",
              [id, normalizedEmail]
            );
          } else {
            await pool.query(
              "UPDATE COMPANY_EMAILS SET EMAIL_ADDRESS = $1 WHERE FK_COMPANY_ID = $2",
              [normalizedEmail, id]
            );
          }
          await markCompanyUpdated(id, lastUpdatedBy);
        }
      } else if (existingEmail) {
        // Email cleared by user; remove associated row to satisfy NOT NULL constraint
        await pool.query(
          "DELETE FROM COMPANY_EMAILS WHERE FK_COMPANY_ID = $1",
          [id]
        );
        await markCompanyUpdated(id, lastUpdatedBy);
      }
    }

    // Check and update/insert phone
    if (
      newData.phone_number !== undefined &&
      newData.phone_number !== existingCompany.rows[0].phone_number
    ) {
      const phoneExists = await pool.query(
        "SELECT 1 FROM COMPANY_PHONES WHERE FK_COMPANY_ID = $1",
        [id]
      );
      if (phoneExists.rows.length === 0) {
        await pool.query(
          "INSERT INTO COMPANY_PHONES (FK_COMPANY_ID, PHONE_NUMBER) VALUES ($1, $2)",
          [id, newData.phone_number]
        );
      } else {
        await pool.query(
          "UPDATE COMPANY_PHONES SET PHONE_NUMBER = $1 WHERE FK_COMPANY_ID = $2",
          [newData.phone_number, id]
        );
      }
      await markCompanyUpdated(id, lastUpdatedBy);
    }

    // Check and update/insert notes
    if (
      newData.note_text !== undefined &&
      newData.note_text !== existingCompany.rows[0].note_text
    ) {
      const noteExists = await pool.query(
        "SELECT 1 FROM COMPANY_NOTES WHERE FK_COMPANY_ID = $1",
        [id]
      );
      if (noteExists.rows.length === 0) {
        await pool.query(
          "INSERT INTO COMPANY_NOTES (FK_COMPANY_ID, NOTE_TEXT) VALUES ($1, $2)",
          [id, newData.note_text]
        );
      } else {
        await pool.query(
          "UPDATE COMPANY_NOTES SET NOTE_TEXT = $1 WHERE FK_COMPANY_ID = $2",
          [newData.note_text, id]
        );
      }
      await markCompanyUpdated(id, lastUpdatedBy);
    }
    // do the same for addresses
    updateClauses = [];
    updateValues = [];
    paramIdx = 1;

    if (
      newData.street_address !== undefined &&
      newData.street_address !== existingCompany.rows[0].street_address
    ) {
      updateClauses.push(`STREET_ADDRESS = $${paramIdx++}`);
      updateValues.push(newData.street_address);
    }
    if (
      newData.city !== undefined &&
      newData.city !== existingCompany.rows[0].city
    ) {
      updateClauses.push(`CITY = $${paramIdx++}`);
      updateValues.push(newData.city);
    }
    if (
      newData.state !== undefined &&
      newData.state !== existingCompany.rows[0].state
    ) {
      updateClauses.push(`STATE = $${paramIdx++}`);
      updateValues.push(newData.state);
    }
    if (
      newData.postal_code !== undefined &&
      newData.postal_code !== existingCompany.rows[0].postal_code
    ) {
      updateClauses.push(`POSTAL_CODE = $${paramIdx++}`);
      updateValues.push(newData.postal_code);
    }

    //update or insert address record(s) if any address fields were provided
    if (updateClauses.length > 0) {
      const addressExists = await pool.query(
        "SELECT 1 FROM COMPANY_ADDRESSES WHERE FK_COMPANY_ID = $1",
        [id]
      );

      if (addressExists.rows.length === 0) {
        const insertCols = [
          "FK_COMPANY_ID",
          ...updateClauses.map((c) => c.split(" = ")[0]),
        ];
        const insertPlaceholders = Array(insertCols.length)
          .fill()
          .map((_, i) => `$${i + 1}`);
        await pool.query(
          `INSERT INTO COMPANY_ADDRESSES (${insertCols.join(
            ", "
          )}) VALUES (${insertPlaceholders.join(", ")})`,
          [id, ...updateValues]
        );
      } else {
        const sql = `UPDATE COMPANY_ADDRESSES SET ${updateClauses.join(
          ", "
        )} WHERE FK_COMPANY_ID = $${paramIdx}`;
        updateValues.push(id);
        await pool.query(sql, updateValues);
      }
      await markCompanyUpdated(id, lastUpdatedBy);
    }

    res.json({ message: "Company updated successfully" });
  } catch (err) {
    console.error(err.message);
  }
});

//delete a company
app.delete("/company/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM COMPANIES WHERE COMPANY_ID = $1", [id]);
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/directory/status", (req, res) => {
  const running = activeDirectoryProcess !== null;
  res.json({ running });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on http://localhost:5000");
});

app.post("/directory/cancel", (req, res) => {
  if (!activeDirectoryProcess) {
    return res.json({ canceled: false, message: "No active scrape running" });
  }

  try {
    activeDirectoryProcess.kill("SIGTERM");
    activeDirectoryProcess = null;
    return res.json({ canceled: true, message: "Directory scrape canceled" });
  } catch (err) {
    console.error("Failed to cancel directory scraper:", err);
    return res.status(500).json({ error: "Failed to cancel scrape" });
  }
});
