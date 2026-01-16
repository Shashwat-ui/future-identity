import { create } from 'zustand';

export type IdentityModuleType =
  | 'contact'
  | 'social'
  | 'work'
  | 'payment'
  | 'address'
  | 'enterprise';

interface IdentityState {
  activeModule: IdentityModuleType | null;
  setModule: (m: IdentityModuleType) => void;
}

export const useIdentityStore = create<IdentityState>((set) => ({
  activeModule: null,
  setModule: (m) => set({ activeModule: m })
}));