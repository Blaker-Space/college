import OpenAI from "openai";
import aiModels from "../ai-models.json" with { type: "json" };

const urlArg = process.argv[2];
const modelIdArg = process.argv[3];

function findModel(candidate) {
  if (!candidate) return null;
  const trimmed = candidate.trim();
  if (!trimmed) return null;
  return (
    aiModels.find((model) => model.id === trimmed) ||
    aiModels.find((model) => model.model === trimmed) ||
    null
  );
}

function getDefaultModel() {
  return (
    aiModels.find((model) => model.default) ||
    (aiModels.length ? aiModels[0] : null)
  );
}

function resolveModel(modelId) {
  const candidates = [modelId, process.env.AI_MODEL_ID, process.env.OPENAI_MODEL];
  for (const value of candidates) {
    const resolved = findModel(value);
    if (resolved) return resolved;
  }
  const fallback = getDefaultModel();
  if (fallback) return fallback;
  throw new Error("No AI models have been configured. Please update server/ai-models.json.");
}

function requireApiKey(model) {
  const envVar = model.envVar;
  if (!envVar) return undefined;
  const key = process.env[envVar];
  if (!key) {
    throw new Error(
      `${model.label || model.id} requires the ${envVar} environment variable to be set.`
    );
  }
  return key;
}

async function callOpenAI(modelConfig, prompt) {
  const apiKey = requireApiKey(modelConfig) || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable for OpenAI model.");
  }
  const client = new OpenAI({ apiKey });
  const modelName = modelConfig.model || process.env.OPENAI_MODEL || "gpt-4o-mini";
  const response = await client.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
  });

  const text = response.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }
  return text;
}

async function callGemini(modelConfig, prompt) {
  const apiKey = requireApiKey(modelConfig) || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable for Gemini model.");
  }

  const modelName = modelConfig.model || modelConfig.id;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    modelName
  )}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Gemini API error ${response.status}${errorText ? `: ${errorText}` : ""}`
    );
  }

  const data = await response.json();
  const candidate = data?.candidates?.find((item) => item?.content?.parts?.length);
  if (!candidate) {
    throw new Error("Gemini response did not contain any candidates.");
  }

  const text = candidate.content.parts
    .map((part) => part?.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

async function callOpenRouter(modelConfig, prompt) {
  const apiKey = requireApiKey(modelConfig) || process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY environment variable for OpenRouter model.");
  }

  const modelName = modelConfig.model || modelConfig.id;
  const endpoint = "https://openrouter.ai/api/v1/chat/completions";
  const referer = process.env.OPENROUTER_SITE || process.env.APP_URL || "http://localhost";
  const title = process.env.OPENROUTER_TITLE || "Location-Based Web Crawler";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": referer,
      "X-Title": title,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `OpenRouter API error ${response.status}${errorText ? `: ${errorText}` : ""}`
    );
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return text;
}

async function generateResponse(modelConfig, prompt) {
  switch (modelConfig.provider) {
    case "openai":
      return callOpenAI(modelConfig, prompt);
    case "gemini":
      return callGemini(modelConfig, prompt);
    case "openrouter":
      return callOpenRouter(modelConfig, prompt);
    default:
      throw new Error(`Unsupported model provider: ${modelConfig.provider}`);
  }
}

// Check robots.txt before scraping
async function checkRobotsTxt(url) {
  try {
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
    const response = await fetch(robotsUrl);
    if (!response.ok) return true; // If no robots.txt, assume allowed
    
    const robotsTxt = await response.text();
    const requestPath = urlObj.pathname.toLowerCase();
    
    // Parse robots.txt to check if User-agent: * has Disallow rules
    const lines = robotsTxt.split('\n').map(line => line.trim());
    let isUniversalAgent = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;
      
      // Check for User-agent directive
      if (line.startsWith('user-agent:')) {
        const agent = line.substring('user-agent:'.length).trim();
        isUniversalAgent = (agent === '*');
        continue; // Move to next line
      }
      
      // If we're in a User-agent: * block and see Disallow
      if (isUniversalAgent && line.startsWith('disallow:')) {
        const disallowedPath = line.substring('disallow:'.length).trim();
        
        // Check if the requested path matches the disallowed path
        if (disallowedPath === '/') {
          // Disallow everything
          throw new Error('This website disallows scraping in robots.txt.');
        } else if (disallowedPath) {
          // Normalize both paths: remove trailing slash for comparison
          const normalizedDisallowed = disallowedPath.endsWith('/') 
            ? disallowedPath.slice(0, -1) 
            : disallowedPath;
          const normalizedRequest = requestPath.endsWith('/') 
            ? requestPath.slice(0, -1) 
            : requestPath;
          
          // Check if paths match (exact or request is subpath of disallowed)
          if (normalizedRequest === normalizedDisallowed || 
              requestPath.startsWith(disallowedPath) ||
              (disallowedPath.endsWith('/') && requestPath.startsWith(normalizedDisallowed + '/'))) {
            throw new Error(`This website disallows scraping the path "${requestPath}" in robots.txt.`);
          }
        }
      }
    }
    
    return true;
  } catch (e) {
    // If it's our "disallow" error, re-throw it
    if (e.message.includes('disallows scraping')) {
      throw e;
    }
    // If we can't fetch robots.txt, proceed (but log it)
    console.warn('Could not check robots.txt:', e.message);
    return true;
  }
}

// Fetch HTML content from the URL
async function fetchHTML(url) {
  try {
    // Check robots.txt first
    await checkRobotsTxt(url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CompanyInfoBot/1.0;)'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return html;
  } catch (e) {
    throw new Error(`Failed to fetch URL: ${e.message}`);
  }
}

// Extract readable text from HTML, removing scripts, styles, and excessive whitespace
function extractTextFromHTML(html) {
  // Remove script and style tags and their content
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Limit to first 15000 characters to stay well under token limits
  if (text.length > 15000) {
    text = text.substring(0, 15000) + '...';
  }
  
  return text;
}

let selectedModel;

try {
  let prompt;
  
  if (urlArg) {
    // Fetch the HTML content
    const html = await fetchHTML(urlArg);
    const textContent = extractTextFromHTML(html);
    
    prompt = `You will output ONLY a JSON object with the following schema: {
  "company_name": string,
  "street_address": string,
  "city": string,
  "state": string,
  "postal_code": string,
  "email_address": string,
  "phone_number": string,
  "website_url": string,
  "notes": string,
  "ai_description": string
}

Extract company information from the following text content from ${urlArg}:

${textContent}

CRITICAL INSTRUCTIONS:
- ONLY extract information that is EXPLICITLY stated in the text
- DO NOT guess, infer, or make assumptions about any field
- Formatting instructions, modify the data you extract so that it follows these conventions:
- For company_name: extract as-is with no formatting changes
- For street_address: use full words (e.g., "123 Main Street" not "123 Main St.")
- For city: capitalize first letter only (e.g., "Tyler" not "tyler" or "TYLER")
- For state: capitalize first letter only (e.g., "Texas" not "texas" or "TEXAS"), and return the full name of the state, not the abbreviation (e.g., "Texas" not "TX")
- For postal_code: must be exactly 5 digits with no spaces or hyphens (e.g., "75701" not "75701-1234")
- For email_address: must be valid format with text@domain.extension (e.g., "info@example.com")
- For phone_number: must be in format 123-456-7890 with hyphens (not parentheses or spaces)
- For website_url: remove http:// or https:// prefix, keep only domain (e.g., "www.example.com" not "https://www.example.com"). Add "www." if missing.
- For notes: input the sentence "Scrape generated with AI\n" if any information was found
- For ai_description: extract factual information as-is with no formatting changes
- If you cannot find verified information for a field, use an empty string ""
- When in doubt, leave the field empty rather than guessing
- Do NOT include any text outside the JSON object`;
  } else {
    prompt = `Output ONLY a JSON object: {"message": "string"} with a short demo message.`;
  }

  selectedModel = resolveModel(modelIdArg);
  const text = await generateResponse(selectedModel, prompt);

  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    obj = { message: text };
  }

  console.log(
    JSON.stringify({
      success: true,
      data: obj,
      meta: {
        modelId: selectedModel.id,
        provider: selectedModel.provider,
        label: selectedModel.label || selectedModel.model || selectedModel.id,
      },
    })
  );
} catch (e) {
  // Ensure the route still gets JSON on failure
  console.log(
    JSON.stringify({
      success: false,
      error: e?.message || String(e),
      meta: selectedModel
        ? {
            modelId: selectedModel.id,
            provider: selectedModel.provider,
            label: selectedModel.label || selectedModel.model || selectedModel.id,
          }
        : undefined,
    })
  );
}