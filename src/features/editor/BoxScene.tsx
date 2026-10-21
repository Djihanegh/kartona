import { useEditor } from "./store";
import { useImage } from "../print/useImage";
import { useFaceTextures } from "../print/useFaceTextures";
import { BoxModel } from "../box/BoxModel";
import type { Design } from "../box/types";

export function BoxScene() {
  const box = useEditor((s) => s.box);
  const d = useEditor((s) => s.design);
  const fold = useEditor((s) => s.fold);
  const logo = useImage(d.logoUrl ?? undefined);

  const design: Design = {
    substrate: d.substrate,
    process: d.process,
    inkColor: d.inkColor,
    brand: d.brand,
    logo,
    logoScale: d.logoScale,
  };

  const textures = useFaceTextures(box, design);
  return <BoxModel params={box} fold={fold} textures={textures} />;
}
