import { useState, useEffect, useMemo, useCallback } from "react";
import { API } from "../functions/definitions";
import { resolveDefaultModelId } from "../functions/formutilities";
import { apiFetch } from "../functions/api";

export default function useAIModels() {
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [lastScrapeMeta, setLastScrapeMeta] = useState(null);

  // Load models on mount
  useEffect(() => {
    let cancelled = false;

    async function loadModels() {
      setIsLoadingModels(true);
      try {
        const res = await apiFetch(`${API}/ai-models`);
        if (!res.ok) {
          const errorText = await res.text().catch(() => "");
          throw new Error(
            `${res.status} ${res.statusText}${errorText ? `: ${errorText}` : ""}`
          );
        }
        const payload = await res.json();
        if (cancelled) return;

        const modelsArray = Array.isArray(payload?.models) ? payload.models : [];
        setAvailableModels(modelsArray);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load AI models", error);
          setAvailableModels([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingModels(false);
        }
      }
    }

    loadModels();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-select default model when models load
  useEffect(() => {
    if (!availableModels.length) {
      setSelectedModelId((prev) => (prev ? "" : prev));
      return;
    }

    const readyModels = availableModels.filter((model) => model.ready);

    if (!readyModels.length) {
      setSelectedModelId((prev) => (prev ? "" : prev));
      return;
    }

    const preferredId = resolveDefaultModelId(readyModels);

    setSelectedModelId((prev) =>
      prev && readyModels.some((model) => model.id === prev) ? prev : preferredId
    );
  }, [availableModels]);

  // Computed values
  const hasReadyModels = useMemo(
    () => availableModels.some((model) => model.ready),
    [availableModels]
  );

  const readyModels = useMemo(
    () => availableModels.filter((model) => model.ready),
    [availableModels]
  );

  const lastScrapeModel = useMemo(() => {
    if (!lastScrapeMeta?.modelId) return null;
    const match = availableModels.find(
      (model) => model.id === lastScrapeMeta.modelId
    );
    if (match) {
      return {
        ...lastScrapeMeta,
        label: match.label,
        provider: match.provider,
      };
    }
    if (lastScrapeMeta.label) return lastScrapeMeta;
    return lastScrapeMeta;
  }, [lastScrapeMeta, availableModels]);

  // Handle model selection
  const handleModelSelect = useCallback(
    (value) => {
      const trimmed = (value || "").trim();
      const selected = availableModels.find((model) => model.id === trimmed);

      if (selected && !selected.ready) {
        setSelectedModelId("");
        return "";
      }

      setSelectedModelId(trimmed);
      return trimmed;
    },
    [availableModels]
  );

  // Get default model ID for ready models
  const getDefaultModelId = useCallback(() => {
    const ready = availableModels.filter((m) => m.ready);
    return resolveDefaultModelId(ready);
  }, [availableModels]);

  // Reset to default selection
  const resetToDefault = useCallback(() => {
    const defaultId = getDefaultModelId();
    setSelectedModelId(defaultId);
    return defaultId;
  }, [getDefaultModelId]);

  // Clear last scrape meta
  const clearScrapeMeta = useCallback(() => {
    setLastScrapeMeta(null);
  }, []);

  return {
    availableModels,
    selectedModelId,
    setSelectedModelId,
    isLoadingModels,
    hasReadyModels,
    readyModels,
    lastScrapeMeta,
    lastScrapeModel,
    setLastScrapeMeta,
    clearScrapeMeta,
    handleModelSelect,
    getDefaultModelId,
    resetToDefault,
  };
}