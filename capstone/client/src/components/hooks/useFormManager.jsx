import { useState, useRef, useMemo, useCallback } from "react";
import {
  sanitizeFieldValue,
  validateFieldValue,
  normalizeWebsite,
  autocompleteStateValue,
  getStateSuggestions,
  prepareFormValuesForUI,
} from "../functions/formutilities";
import {
  WEBSITE_REGEX,
  VALIDATE_ON_SUBMIT_FIELDS,
  FIELD_CHAR_LIMITS,
  US_STATES,
} from "../functions/definitions";

const INITIAL_FORMS = { edit: {}, create: {} };
const INITIAL_ERRORS = { edit: {}, create: {} };
const INITIAL_TOUCHED = { edit: {}, create: {} };

export default function useFormManager() {
  const [forms, setForms] = useState(INITIAL_FORMS);
  const [formErrors, setFormErrors] = useState(INITIAL_ERRORS);
  const [formTouched, setFormTouched] = useState(INITIAL_TOUCHED);
  const formTouchedRef = useRef(formTouched);

  // Keep ref in sync
  const syncTouchedRef = useCallback((next) => {
    formTouchedRef.current = next;
    return next;
  }, []);

  // State datalist options
  const stateDatalistIds = useMemo(
    () => ({ create: "state-options-create", edit: "state-options-edit" }),
    []
  );

  const createStateOptions = useMemo(
    () => getStateSuggestions(forms.create?.state ?? ""),
    [forms.create?.state]
  );

  const editStateOptions = useMemo(
    () => getStateSuggestions(forms.edit?.state ?? ""),
    [forms.edit?.state]
  );

  // Mark a field as touched
  const markFieldTouched = useCallback((formType, field, touched = true) => {
    setFormTouched((prev) => {
      const next = {
        ...prev,
        [formType]: { ...prev[formType], [field]: touched },
      };
      formTouchedRef.current = next;
      return next;
    });
  }, []);

  // Reset form state for a specific form type
  const resetFormState = useCallback((formType) => {
    setForms((prev) => ({ ...prev, [formType]: {} }));
    setFormErrors((prev) => ({ ...prev, [formType]: {} }));
    setFormTouched((prev) => {
      const next = { ...prev, [formType]: {} };
      formTouchedRef.current = next;
      return next;
    });
  }, []);

  // Load initial data into a form
  const loadFormData = useCallback((formType, data) => {
    const prepared = prepareFormValuesForUI(data || {});
    setForms((prev) => ({ ...prev, [formType]: prepared }));
    setFormErrors((prev) => ({ ...prev, [formType]: {} }));
    setFormTouched((prev) => {
      const next = { ...prev, [formType]: {} };
      formTouchedRef.current = next;
      return next;
    });
  }, []);

  // Update a form field with optional validation
  const updateFormField = useCallback(
    (
      formType,
      field,
      rawValue,
      {
        forceValidate = false,
        overrideSanitizedValue,
        normalizedValue,
        customError,
      } = {}
    ) => {
      const sanitized =
        overrideSanitizedValue !== undefined
          ? overrideSanitizedValue
          : sanitizeFieldValue(field, rawValue);

      setForms((prev) => ({
        ...prev,
        [formType]: { ...prev[formType], [field]: sanitized },
      }));

      const shouldValidate =
        forceValidate || !!formTouchedRef.current?.[formType]?.[field];

      if (shouldValidate || customError !== undefined) {
        const validationValue =
          normalizedValue !== undefined ? normalizedValue : sanitized;
        const errorMessage =
          customError !== undefined
            ? customError
            : validateFieldValue(field, validationValue);

        setFormErrors((prev) => ({
          ...prev,
          [formType]: { ...prev[formType], [field]: errorMessage },
        }));
      } else if (!sanitized) {
        setFormErrors((prev) => {
          const current = prev[formType] ?? {};
          if (!current[field]) return prev;
          const nextFormErrors = { ...current };
          delete nextFormErrors[field];
          return { ...prev, [formType]: nextFormErrors };
        });
      }

      return sanitized;
    },
    []
  );

  // Handle field blur with special handling for website and state
  const handleFieldBlur = useCallback(
    (formType, field, rawValue) => {
      markFieldTouched(formType, field, true);

      if (field === "website_url") {
        const currentValue = rawValue ?? forms[formType]?.[field] ?? "";
        const trimmedValue = currentValue.trim();

        if (!trimmedValue) {
          updateFormField(formType, field, "", { forceValidate: true });
          return { field, value: "" };
        }

        if (!WEBSITE_REGEX.test(trimmedValue)) {
          updateFormField(formType, field, trimmedValue, {
            forceValidate: true,
            overrideSanitizedValue: trimmedValue,
            customError: "Please enter a valid website URL",
          });
          return { field, value: trimmedValue, error: true };
        }

        const normalized = normalizeWebsite(trimmedValue);
        const valueForField = normalized ?? trimmedValue;

        updateFormField(formType, field, valueForField, {
          forceValidate: true,
          overrideSanitizedValue: valueForField,
          normalizedValue: valueForField,
        });

        return { field, value: valueForField };
      }

      if (field === "state") {
        const currentValue = rawValue ?? forms[formType]?.[field] ?? "";
        const autoFilled = autocompleteStateValue(currentValue);
        updateFormField(formType, field, autoFilled, {
          forceValidate: true,
          overrideSanitizedValue: autoFilled,
        });
        return { field, value: autoFilled };
      }

      const currentValue = rawValue ?? forms[formType]?.[field] ?? "";
      const sanitizedValue = updateFormField(formType, field, currentValue, {
        forceValidate: true,
      });

      return { field, value: sanitizedValue };
    },
    [forms, markFieldTouched, updateFormField]
  );

  // Validate entire form
  const validateForm = useCallback(
    (formType) => {
      const currentValues = forms[formType] ?? {};
      const nextErrors = { ...formErrors[formType] };
      let isValid = true;

      VALIDATE_ON_SUBMIT_FIELDS.forEach((field) => {
        const value = currentValues[field] ?? "";
        const error = validateFieldValue(field, value);
        nextErrors[field] = error;
        if (error) isValid = false;
      });

      setFormErrors((prev) => ({
        ...prev,
        [formType]: nextErrors,
      }));

      setFormTouched((prev) => {
        const touched = { ...prev[formType] };
        VALIDATE_ON_SUBMIT_FIELDS.forEach((field) => {
          touched[field] = true;
        });
        const next = { ...prev, [formType]: touched };
        formTouchedRef.current = next;
        return next;
      });

      return isValid;
    },
    [forms, formErrors]
  );

  // Get UI props for a field (error, datalist, input props, etc.)
  const getFieldUIProps = useCallback(
    (formType, field) => {
      const error = formErrors[formType]?.[field] || "";
      const datalistId =
        field === "state" ? stateDatalistIds[formType] : undefined;
      const datalistOptions =
        field === "state"
          ? formType === "create"
            ? createStateOptions
            : editStateOptions
          : [];

      const inputProps = {};
      const charLimit = FIELD_CHAR_LIMITS[field];

      if (
        VALIDATE_ON_SUBMIT_FIELDS.includes(field) ||
        field === "city" ||
        field === "state"
      ) {
        inputProps.onBlur = (event) =>
          handleFieldBlur(formType, field, event.target.value);
      }

      switch (field) {
        case "phone_number":
          inputProps.inputMode = "numeric";
          inputProps.pattern = "[0-9-]*";
          inputProps.maxLength = 12;
          inputProps.autoComplete = "tel";
          break;
        case "postal_code":
          inputProps.inputMode = "numeric";
          inputProps.pattern = "\\d*";
          inputProps.maxLength = 5;
          inputProps.autoComplete = "postal-code";
          break;
        case "website_url":
          inputProps.autoComplete = "url";
          inputProps.pattern = WEBSITE_REGEX.source.replace(/^\^|\$$/g, "");
          inputProps.title =
            "Enter a valid website (e.g. https://www.example.com)";
          break;
        case "email_address":
          inputProps.autoComplete = "email";
          break;
        case "city":
          inputProps.autoComplete = "address-level2";
          break;
        case "state":
          inputProps.autoComplete = "address-level1";
          break;
        default:
          break;
      }

      const selectOptions = field === "state" ? US_STATES : [];

      return {
        error,
        datalistId,
        datalistOptions,
        inputProps,
        charLimit,
        options: selectOptions,
      };
    },
    [
      formErrors,
      stateDatalistIds,
      createStateOptions,
      editStateOptions,
      handleFieldBlur,
    ]
  );

  // Direct setter for forms (for advanced use cases)
  const setFormValues = useCallback((formType, values) => {
    setForms((prev) => ({ ...prev, [formType]: values }));
  }, []);

  // Set a specific error
  const setFieldError = useCallback((formType, field, error) => {
    setFormErrors((prev) => ({
      ...prev,
      [formType]: { ...prev[formType], [field]: error },
    }));
  }, []);

  // Clear all errors for a form
  const clearFormErrors = useCallback((formType) => {
    setFormErrors((prev) => ({ ...prev, [formType]: {} }));
  }, []);

  return {
    forms,
    formErrors,
    formTouched,
    setForms,
    setFormErrors,
    setFormTouched,
    markFieldTouched,
    resetFormState,
    loadFormData,
    updateFormField,
    handleFieldBlur,
    validateForm,
    getFieldUIProps,
    setFormValues,
    setFieldError,
    clearFormErrors,
    createStateOptions,
    editStateOptions,
    stateDatalistIds,
  };
}