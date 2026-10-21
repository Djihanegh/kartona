import { create } from "zustand";
import type { BoxParams, PrintProcess, Substrate } from "../box/types";

export interface DesignState {
  substrate: Substrate;
  process: PrintProcess;
  inkColor: string;
  brand: string;
  logoUrl: string | null; // texte, donc sauvegardable plus tard
  logoScale: number;
}

interface EditorState {
  box: BoxParams;
  design: DesignState;
  setBox: (patch: Partial<BoxParams>) => void;
  setDesign: (patch: Partial<DesignState>) => void;
}

export const useEditor = create<EditorState>()((set) => ({
  box: { length: 300, width: 200, height: 100, flute: "E", fold: 1 },
  design: {
    substrate: "kraft",
    process: "flexo",
    inkColor: "#245a35",
    brand: "Dar Zitoun",
    logoUrl: null,
    logoScale: 55,
  },
  setBox: (patch) => set((s) => ({ box: { ...s.box, ...patch } })),
  setDesign: (patch) => set((s) => ({ design: { ...s.design, ...patch } })),
}));
