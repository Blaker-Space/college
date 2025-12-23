import React from "react";
import { form } from "././styles";

export default function SearchBar({
  value,
  onChange,
  onClear,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Escape" && value) {
      event.preventDefault();
      onClear();
    }
  };

  return (
    <div className="flex-1 min-w-[260px] max-w-[440px]">
      <label
        htmlFor="company-search"
        className="block text-sm font-semibold text-slate-200"
      >
        Search companies
      </label>
      <div className="relative">
        <input
          id="company-search"
          type="search"
          className={`${form.input} !py-1 pr-16 text-sm text-slate-800 placeholder:text-slate-400`}
          placeholder="Search by name, website, state..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {value ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-2 my-auto text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}