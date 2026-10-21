import { useEditor } from "./store";
import { useImage } from "../print/useImage";
import type { Design } from "../box/types";
import { useFaceCanvases } from "../print/useFaceCanvases";

export function useEditorArtwork() {
  const box = useEditor((s) => s.box);
  const d = useEditor((s) => s.design);
  const logo = useImage(d.logoUrl ?? undefined);

  const pick = (i: number) => d.inks[i] ?? d.inks[0];

  const design: Design = {
    substrate: d.substrate,
    process: d.process,
    colors: {
      logo: pick(d.assign.logo),
      brand: pick(d.assign.brand),
      marks: pick(d.assign.marks),
    },
    brand: d.brand,
    logo,
    logoScale: d.logoScale,
  };

  const canvases = useFaceCanvases(box, design);
  return { box, canvases };
}
