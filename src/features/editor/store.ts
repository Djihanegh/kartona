import { create } from "zustand";
import type { BoxParams, PrintProcess, Substrate } from "../box/types";

export interface DesignState {
  substrate: Substrate;
  process: PrintProcess;
  inkColor: string;
  brand: string;
  logoUrl: string | null;
  logoScale: number;
}

interface EditorState {
  // Le produit (sera sauvegardé)
  box: BoxParams;
  design: DesignState;
  // L'affichage (ne sera pas sauvegardé)
  fold: number;

  setBox: (patch: Partial<BoxParams>) => void;
  setDesign: (patch: Partial<DesignState>) => void;
  setFold: (fold: number) => void;
}

export const useEditor = create<EditorState>()((set) => ({
  box: { length: 300, width: 200, height: 100, flute: "E" },
  design: {
    substrate: "kraft",
    process: "flexo",
    inkColor: "#245a35",
    brand: "Dar Zitoun",
    logoUrl: null,
    logoScale: 55,
  },
  fold: 1,

  setBox: (patch) => set((s) => ({ box: { ...s.box, ...patch } })),
  setDesign: (patch) => set((s) => ({ design: { ...s.design, ...patch } })),
  setFold: (fold) => set({ fold }),
}));
