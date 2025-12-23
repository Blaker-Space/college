# Location-Based-Web-Crawler
Location based web crawler for Capstone designed to scrape company business data off websites.

## AI Models

- **Default (`gpt-4o-mini`)**: Uses `OPENAI_API_KEY` for high-quality structured extractions.
- **Gemini (`gemini-2.0-flash`)**: Enable with `GEMINI_API_KEY` for fast Google summarization.
- **OpenRouter lineup**: Requires a single `OPENROUTER_API_KEY` and now includes the following free models:
	- `sherlock-think-alpha`
	- `sherlock-dash-alpha`
	- `nemotron-nano-12b-v2-vl`
	- `glm-4-5-air`
	- `kimi-k2`
	- `gemma-3n-e2b-it`
	- `mistral-small-3-2-24b-instruct`
	- `mistral-small-3-1-24b-instruct`
	- `llama-3-3-70b-instruct`
	- `mistral-7b-instruct`
	- `hermes-3-llama-3-1-405b`

Update `server/ai-models.json` to adjust defaults or add more providers. All server endpoints automatically surface ready models based on the environment variables that are set.
