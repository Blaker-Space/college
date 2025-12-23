import { useState } from "react";

const INITIAL_MODALS = {
  create: false,
  edit: false,
  deleteMany: false,
  refreshMany: false,
  details: null,
};

export default function useModals() {
  const [modals, setModals] = useState(INITIAL_MODALS);

  const openCreate = () => {
    setModals((m) => ({ ...m, create: true, details: null, edit: false }));
  };

  const closeCreate = () => {
    setModals((m) => ({ ...m, create: false }));
  };

  const openDetails = (rawData) => {
    setModals((m) => ({ ...m, details: rawData }));
  };

  const closeDetails = () => {
    setModals((m) => ({ ...m, details: null, edit: false }));
  };

  const openEdit = (rawData) => {
    setModals((m) => ({ ...m, create: false, details: rawData, edit: true }));
  };

  const closeEdit = () => {
    setModals((m) => ({ ...m, edit: false }));
  };

  const openDeleteMany = () => {
    setModals((m) => ({ ...m, deleteMany: true }));
  };

  const closeDeleteMany = () => {
    setModals((m) => ({ ...m, deleteMany: false }));
  };

  const openRefreshMany = () => {
    setModals((m) => ({ ...m, refreshMany: true }));
  };

  const closeRefreshMany = () => {
    setModals((m) => ({ ...m, refreshMany: false }));
  };

  const updateDetails = (updates) => {
    setModals((m) => ({
      ...m,
      details: m.details ? { ...m.details, ...updates } : null,
    }));
  };

  const setEditMode = (isEditing) => {
    setModals((m) => ({ ...m, edit: isEditing }));
  };

  return {
    modals,
    setModals,
    openCreate,
    closeCreate,
    openDetails,
    closeDetails,
    openEdit,
    closeEdit,
    openDeleteMany,
    closeDeleteMany,
    openRefreshMany,
    closeRefreshMany,
    updateDetails,
    setEditMode,
  };
}