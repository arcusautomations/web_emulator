import { create } from 'zustand';
import type { Toast } from '@/types';

type ModalType =
  | 'quickMenu'
  | 'shaderPicker'
  | 'cheats'
  | 'saveManager'
  | 'syncConflict'
  | null;

interface UIState {
  sidebarCollapsed: boolean;
  activeModal: ModalType;
  isHUDVisible: boolean;
  isFullscreen: boolean;
  toasts: Toast[];

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveModal: (modal: ModalType) => void;
  setHUDVisible: (visible: boolean) => void;
  setFullscreen: (fullscreen: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeModal: null,
  isHUDVisible: true,
  isFullscreen: false,
  toasts: [],

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setHUDVisible: (visible) => set({ isHUDVisible: visible }),
  setFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  addToast: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),
}));
