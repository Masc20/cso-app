'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook to centralize modal open/close controls, selected item tracking, and state reset.
 */
export function useModalState<T = unknown>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openModal = useCallback((item?: T) => {
    if (item !== undefined) {
      setSelectedItem(item);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
  }, []);

  return {
    isOpen,
    selectedItem,
    openModal,
    closeModal,
    setSelectedItem
  };
}
