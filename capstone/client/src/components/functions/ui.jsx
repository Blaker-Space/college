import { useState } from "react";
import { tbl, form, modal, toast } from "../styles";

// UI Functions and components

// Function to render modal component
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div
      className={modal.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={modal.panel} onClick={(e) => e.stopPropagation()}>
        <h3 className={modal.title}>{title}</h3>
        {children}
        {footer && <div className={modal.footer}>{footer}</div>}
      </div>
    </div>
  );
}

// Functions to render table rows
export function FieldRow({
  label,
  edit,
  value,
  onChange,
  type = "text",
  rowIndex = 0,
  error,
  datalistId,
  datalistOptions = [],
  inputProps = {},
  options = [],
  charLimit,
}) {
  const stripeClass = rowIndex % 2 === 0 ? "bg-white" : "bg-slate-50";
  const {
    onChange: inputOnChange,
    onBlur: inputOnBlur,
    onFocus: inputOnFocus,
    ...restInputProps
  } = inputProps;
  const [isFocused, setIsFocused] = useState(false);
  const resolvedInputProps = { ...restInputProps };
  if (charLimit && resolvedInputProps.maxLength == null) {
    resolvedInputProps.maxLength = charLimit;
  }
  const handleChange = (event) => {
    inputOnChange?.(event);
    onChange(event.target.value);
  };
  const handleBlur = (event) => {
    setIsFocused(false);
    inputOnBlur?.(event);
  };
  const handleFocus = (event) => {
    setIsFocused(true);
    inputOnFocus?.(event);
  };
  const safeValue = value ?? "";
  const normalizedOptions = Array.isArray(options) ? options : [];
  const hasValueOption = normalizedOptions.some((option) => {
    const optionValue = typeof option === "string" ? option : option.value;
    return optionValue === safeValue;
  });
  const currentLength = charLimit
    ? (typeof safeValue === "string" ? safeValue : String(safeValue)).length
    : 0;
  const charHelper =
    charLimit && isFocused ? (
      <span className="mt-1 text-[11px] italic text-slate-500">
        {currentLength}/{charLimit} characters
      </span>
    ) : null;

  const shouldRenderSelect =
    type === "select" || normalizedOptions.length > 0;

  return (
    <tr className={stripeClass}>
      <th className={`${tbl.th} ${stripeClass}`}>{label}</th>
      <td className={`${tbl.td} ${stripeClass}`}>
        {edit ? (
          <div className="flex flex-col gap-1">
            {type === "textarea" ? (
              <textarea
                className={`${form.input} ${
                  error ? form.inputError : ""
                }`.trim()}
                rows={4}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                {...resolvedInputProps}
              />
            ) : shouldRenderSelect ? (
              <select
                className={`${form.input} ${
                  error ? form.inputError : ""
                }`.trim()}
                value={value ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                {...resolvedInputProps}
              >
                <option value="">Select an option</option>
                {normalizedOptions.map((option) => {
                  const optionValue =
                    typeof option === "string" ? option : option.value;
                  const optionLabel =
                    typeof option === "string" ? option : option.label;
                  return (
                    <option key={optionValue} value={optionValue}>
                      {optionLabel}
                    </option>
                  );
                })}
                {!hasValueOption && safeValue && (
                  <option value={safeValue}>{safeValue}</option>
                )}
              </select>
            ) : (
              <>
                <input
                  className={`${form.input} ${
                    error ? form.inputError : ""
                  }`.trim()}
                  type={type}
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  list={datalistId}
                  {...resolvedInputProps}
                />
                {datalistId && (
                  <datalist id={datalistId}>
                    {datalistOptions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                )}
              </>
            )}
            {charHelper}
            {error ? <span className={form.errorText}>{error}</span> : null}
          </div>
        ) : (
          valueOrNone(value)
        )}
      </td>
    </tr>
  );
}

// Function to render form fields
export function FormField({
  label,
  type = "text",
  value,
  onChange,
  required,
  rows = 4,
  placeholder,
  error,
  datalistId,
  datalistOptions = [],
  options = [],
  inputProps = {},
  charLimit,
}) {
  const baseClass = `${form.input} ${error ? form.inputError : ""}`.trim();
  const {
    onChange: inputOnChange,
    onBlur: inputOnBlur,
    onFocus: inputOnFocus,
    ...restInputProps
  } = inputProps;
  const [isFocused, setIsFocused] = useState(false);
  const mergedInputProps = { ...restInputProps };
  if (charLimit && mergedInputProps.maxLength == null) {
    mergedInputProps.maxLength = charLimit;
  }
  const handleChange = (event) => {
    inputOnChange?.(event);
    onChange?.(event.target.value);
  };
  const handleBlur = (event) => {
    setIsFocused(false);
    inputOnBlur?.(event);
  };
  const handleFocus = (event) => {
    setIsFocused(true);
    inputOnFocus?.(event);
  };
  const safeValue = value ?? "";
  const currentLength = charLimit
    ? (typeof safeValue === "string" ? safeValue : String(safeValue)).length
    : 0;
  const charHelper =
    charLimit && isFocused ? (
      <span className="mt-1 text-[11px] italic text-slate-500">
        {currentLength}/{charLimit} characters
      </span>
    ) : null;

  return (
    <label className={form.label}>
      <span className={form.labelText}>
        {label}
        {required && <span className={form.requiredStar}>*</span>}
      </span>
      {type === "textarea" ? (
        <textarea
          className={baseClass}
          rows={rows}
          value={value ?? ""}
          placeholder={placeholder}
          required={required}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...mergedInputProps}
        />
      ) : type === "select" ? (
        <select
          className={baseClass}
          value={value ?? ""}
          required={required}
          onChange={handleChange}
          onBlur={handleBlur}
          {...restInputProps}
        >
          {placeholder ? (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          ) : !required ? (
            <option value="" />
          ) : null}
          {options.map((option) => {
            const optionValue =
              typeof option === "string" ? option : option.value;
            const optionLabel =
              typeof option === "string" ? option : option.label;
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
      ) : (
        <>
          <input
            type={type}
            className={baseClass}
            value={value ?? ""}
            placeholder={placeholder}
            required={required}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            list={datalistId}
            {...mergedInputProps}
          />
          {datalistId && (
            <datalist id={datalistId}>
              {datalistOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          )}
        </>
      )}
      {charHelper}
      {error ? <span className={form.errorText}>{error}</span> : null}
    </label>
  );
}

// Function to render toast notifications
export function toastStack({ toasts }) {
  return (
    <div className={toast.wrapper}>
      {toasts.success && (
        <div className={`${toast.cardBase} ${toast.success}`} role="status">
          {toasts.success}
        </div>
      )}
      {toasts.error && (
        <div className={`${toast.cardBase} ${toast.error}`} role="alert">
          {toasts.error}
        </div>
      )}
      {toasts.info && (
        <div className={`${toast.cardBase} ${toast.info}`} role="status">
          {toasts.info}
        </div>
      )}
    </div>
  );
}

// Function to parse toast notifications, change duration to adjust notification visibility time
export function showToast(setToasts, type, message, duration = 2000) {
  setToasts((t) => ({ ...t, [type]: message }));
  setTimeout(() => setToasts((t) => ({ ...t, [type]: "" })), duration);
}

// Returns value or "None" if empty; used to properly display empty fields
export const valueOrNone = (value) => (value ?? "").toString().trim() || "None";

export const stripeClass = (index) =>
  index % 2 === 0 ? "bg-zinc-50" : "bg-slate-200";
