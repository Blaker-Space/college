import { useEffect, useMemo, useRef, useState } from "react";

// Custom hook to manage row selection in a table of companies
export default function useRowSelection(
  companies,
  visibleCompanies = companies
) {
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const selectAllCheckboxRef = useRef(null);

  useEffect(() => {
    if (!companies.length) {
      clearSelection();
      return;
    }

    setSelectedRows((prev) => {
      if (!prev.size) return prev;
      const validIds = new Set(companies.map((c) => c._id));
      const next = new Set();
      prev.forEach((id) => {
        if (validIds.has(id)) next.add(id);
      });
      return next.size === prev.size ? prev : next;
    });
    setLastSelectedIndex(null);
  }, [companies]);

  useEffect(() => {
    setLastSelectedIndex(null);
  }, [visibleCompanies]);

  const totalVisible = visibleCompanies.length;
  const visibleSelectedCount = useMemo(() => {
    if (!visibleCompanies.length || !selectedRows.size) return 0;
    return visibleCompanies.reduce((count, company) => {
      if (company?._id && selectedRows.has(company._id)) {
        return count + 1;
      }
      return count;
    }, 0);
  }, [selectedRows, visibleCompanies]);

  useEffect(() => {
    if (!selectAllCheckboxRef.current) return;
    const checkbox = selectAllCheckboxRef.current;
    checkbox.indeterminate =
      visibleSelectedCount > 0 && visibleSelectedCount < totalVisible;
  }, [visibleSelectedCount, totalVisible]);

  function clearSelection() {
    setSelectedRows(new Set());
    setLastSelectedIndex(null);
  }

  function handleSelectAllChange(event) {
    const { checked } = event.target;
    if (!visibleCompanies.length) {
      setLastSelectedIndex(null);
      return;
    }

    if (!checked) {
      setSelectedRows((prev) => {
        if (!prev.size) return prev;
        const next = new Set(prev);
        visibleCompanies.forEach((company) => {
          if (company?._id) next.delete(company._id);
        });
        return next;
      });
      setLastSelectedIndex(null);
      return;
    }

    setSelectedRows((prev) => {
      const next = new Set(prev);
      visibleCompanies.forEach((company) => {
        if (company?._id) next.add(company._id);
      });
      return next;
    });
    setLastSelectedIndex(null);
  }

  function handleRowCheckboxChange(event, company, rowIndex) {
    event.stopPropagation();
    const { checked } = event.target;
    const isShift = event.nativeEvent?.shiftKey;

    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (isShift && lastSelectedIndex !== null && visibleCompanies.length) {
        const start = Math.min(lastSelectedIndex, rowIndex);
        const end = Math.max(lastSelectedIndex, rowIndex);
        for (let idx = start; idx <= end; idx += 1) {
          const targetId = visibleCompanies[idx]?._id;
          if (!targetId) continue;
          if (checked) next.add(targetId);
          else next.delete(targetId);
        }
      } else {
        if (checked) next.add(company._id);
        else next.delete(company._id);
      }
      return next;
    });

    setLastSelectedIndex(rowIndex);
  }

  const selectedCount = selectedRows.size;
  const totalSelectable = totalVisible;
  const hasSelection = selectedCount > 0;
  const isSelectAllChecked =
    totalSelectable > 0 && visibleSelectedCount === totalSelectable;

  return {
    selectedRows,
    selectedCount,
    hasSelection,
    isSelectAllChecked,
    selectAllCheckboxRef,
    setLastSelectedIndex,
    handleSelectAllChange,
    handleRowCheckboxChange,
    clearSelection,
  };
}
