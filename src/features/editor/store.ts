import { create } from "zustand";
import type {
  BoxParams,
  PrintElement,
  PrintProcess,
  Substrate,
} from "../box/types";
import { spotLimit } from "../print/processes";

export interface DesignState {
  substrate: Substrate;
  process: PrintProcess;
  inks: string[]; // palette : 1 à spotLimit(process) encres
  assign: Record<PrintElement, number>; // index de l'encre de chaque élément
  brand: string;
  logoUrl: string | null;
  logoScale: number;
}

interface EditorState {
  box: BoxParams;
  design: DesignState;
  fold: number;

  setBox: (patch: Partial<BoxParams>) => void;
  setDesign: (patch: Partial<DesignState>) => void;
  setFold: (fold: number) => void;

  setProcess: (process: PrintProcess) => void;
  addInk: () => void;
  updateInk: (index: number, hex: string) => void;
  removeInk: (index: number) => void;
  assignInk: (element: PrintElement, index: number) => void;
}

// Couleurs proposées quand on ajoute une encre
const SUGGESTED_INKS = [
  "#1b1b1b",
  "#1c2a6e",
  "#a3271f",
  "#c9721a",
  "#245a35",
  "#6b2d6b",
  "#0f6e6e",
  "#7a5a33",
];

// Ramène les attributions dans la palette (une encre supprimée → encre 1)
function clampAssign(assign: Record<PrintElement, number>, count: number) {
  const fix = (i: number) => (i < count ? i : 0);
  return {
    logo: fix(assign.logo),
    brand: fix(assign.brand),
    marks: fix(assign.marks),
  };
}

export const useEditor = create<EditorState>()((set) => ({
  box: { length: 300, width: 200, height: 100, flute: "E" },
  design: {
    substrate: "kraft",
    process: "flexo",
    inks: ["#245a35", "#1b1b1b"],
    assign: { logo: 0, brand: 0, marks: 1 },
    brand: "Dar Zitoun",
    logoUrl: null,
    logoScale: 55,
  },
  fold: 1,

  setBox: (patch) => set((s) => ({ box: { ...s.box, ...patch } })),
  setDesign: (patch) => set((s) => ({ design: { ...s.design, ...patch } })),
  setFold: (fold) => set({ fold }),

  // Changer de procédé peut réduire le nombre d'encres disponibles
  setProcess: (process) =>
    set((s) => {
      const inks = s.design.inks.slice(0, spotLimit(process));
      return {
        design: {
          ...s.design,
          process,
          inks,
          assign: clampAssign(s.design.assign, inks.length),
        },
      };
    }),

  addInk: () =>
    set((s) => {
      const { inks, process } = s.design;
      if (inks.length >= spotLimit(process)) return {};
      const next = SUGGESTED_INKS.find((c) => !inks.includes(c)) ?? "#1b1b1b";
      return { design: { ...s.design, inks: [...inks, next] } };
    }),

  updateInk: (index, hex) =>
    set((s) => ({
      design: {
        ...s.design,
        inks: s.design.inks.map((c, i) => (i === index ? hex : c)),
      },
    })),

  removeInk: (index) =>
    set((s) => {
      const { inks, assign } = s.design;
      if (inks.length <= 1) return {}; // il faut au moins une encre
      // Les encres après celle supprimée reculent d'une place
      const shift = (i: number) => (i === index ? 0 : i > index ? i - 1 : i);
      return {
        design: {
          ...s.design,
          inks: inks.filter((_, i) => i !== index),
          assign: {
            logo: shift(assign.logo),
            brand: shift(assign.brand),
            marks: shift(assign.marks),
          },
        },
      };
    }),

  assignInk: (element, index) =>
    set((s) => ({
      design: { ...s.design, assign: { ...s.design.assign, [element]: index } },
    })),
}));
