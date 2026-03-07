"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UIState = {
  isSidebarOpen: boolean;
  isGlobalSearchOpen: boolean;
};

type UIActions = {
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  toggleGlobalSearch: () => void;
};

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isGlobalSearchOpen: false,
      toggleSidebar: () =>
        set((state) => ({
          isSidebarOpen: !state.isSidebarOpen,
        })),
      setSidebarOpen: (isOpen) =>
        set({
          isSidebarOpen: isOpen,
        }),
      openGlobalSearch: () =>
        set({
          isGlobalSearchOpen: true,
        }),
      closeGlobalSearch: () =>
        set({
          isGlobalSearchOpen: false,
        }),
      toggleGlobalSearch: () =>
        set((state) => ({
          isGlobalSearchOpen: !state.isGlobalSearchOpen,
        })),
    }),
    {
      name: "qurafy-ui-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
      }),
    },
  ),
);

export const useSidebarOpen = () => useUIStore((state) => state.isSidebarOpen);
export const useGlobalSearchOpen = () => useUIStore((state) => state.isGlobalSearchOpen);
