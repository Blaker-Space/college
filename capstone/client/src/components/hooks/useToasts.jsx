import { useState, useCallback } from "react";
import { showToast as showToastUtil } from "../functions/ui";

export default function useToasts() {
  const [toasts, setToasts] = useState({
    success: "",
    error: "",
    info: "",
  });

  const showToast = useCallback((type, message) => {
    showToastUtil(setToasts, type, message);
  }, []);

  const clearToast = useCallback((type) => {
    setToasts((prev) => ({ ...prev, [type]: "" }));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts({ success: "", error: "", info: "" });
  }, []);

  return {
    toasts,
    setToasts,
    showToast,
    clearToast,
    clearAllToasts,
  };
}