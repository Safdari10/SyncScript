import { create } from "zustand";

type DocumentState = {
  content: string;
  clientId: string;
  version: number;
  setContent: (content: string) => void;
  incrementVersion: () => void;
};

export const useDocumentStore = create<DocumentState>()((set) => ({
  content: "",
  clientId: Math.random().toString(36).substring(2, 10),
  version: 0,
  setContent: (content: string) => set({ content }),
  incrementVersion: () => set((state) => ({ version: state.version + 1 })),
}));
