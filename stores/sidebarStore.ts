import { create } from "zustand";

type SidebarStore = {
  isDesktopSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isDesktopSidebarOpen: true,
  isMobileSidebarOpen: false,
  openMobileSidebar: () => set({ isMobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
}));
