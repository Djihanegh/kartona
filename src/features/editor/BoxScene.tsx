import { useEditor } from "./store";
import { useImage } from "../print/useImage";
import { useFaceTextures } from "../print/useFaceTextures";
import { BoxModel } from "../box/BoxModel";
import type { Design } from "../box/types";
import { boxRoot } from "../ar/boxRef";

export function BoxScene() {
  const box = useEditor((s) => s.box);
  const d = useEditor((s) => s.design);
  const fold = useEditor((s) => s.fold);
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

  const textures = useFaceTextures(box, design);
  return (
    <BoxModel ref={boxRoot} params={box} fold={fold} textures={textures} />
  );
}
