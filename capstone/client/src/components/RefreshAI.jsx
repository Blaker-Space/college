import React from "react";
import { btn, form } from "./styles.jsx";

export default function RefreshAI({
  provider,
  onProviderChange: setProvider,
  onRefreshWebsiteData: handleRefreshWebsiteData,
  disabled,
  form,
  selectedModelId,
  handleModelSelect,
  availableModels,
  isLoadingModels,
  hasReadyModels,
  hasEntries,
}) {
  const isDisabled = !selectedModelId || !hasEntries;
  return (
    <div className="flex justify-left">
      <div className="my-1 flex items-center gap-3">
        <label htmlFor="modelSelect" className="text-sm font-medium text-white">
          Select provider:
        </label>
        <div className="relative">
          <select
            className="rounded-lg p-1.5 text-sm outline-none"
            value={selectedModelId}
            onChange={(e) => handleModelSelect(e.target.value)}
            disabled={isLoadingModels || !availableModels.length}
          >
            {isLoadingModels ? (
              <option value="">Loading models...</option>
            ) : availableModels.length ? (
              <>
                <option value="" disabled={hasReadyModels}>
                  {hasReadyModels
                    ? "Select an AI model"
                    : "No ready models - add API keys"}
                </option>
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id} disabled={!model.ready}>
                    {model.label}
                    {!model.ready ? " (API key required)" : ""}
                  </option>
                ))}
              </>
            ) : (
              <option value="">No models configured</option>
            )}
          </select>
        </div>
        <button
          className={
            btn.primary + " text-sm flex items-center justify-center" +
            (disabled ? btn.ghost : "")
          }
          onClick={handleRefreshWebsiteData}
          disabled={isDisabled || disabled}
        >
          Refresh with AI
        </button>
      </div>
    </div>
  );
}
