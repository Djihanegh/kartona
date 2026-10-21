import { useEditor } from "./store";
import { useFaceTextures } from "../print/useFaceTextures";
import type { FaceCanvases } from "../print/useFaceCanvases";
import { BoxModel } from "../box/BoxModel";
import { boxRoot } from "../ar/boxRef";

export function BoxScene({ canvases }: { canvases: FaceCanvases }) {
  const box = useEditor((s) => s.box);
  const fold = useEditor((s) => s.fold);
  const textures = useFaceTextures(canvases);
  return (
    <BoxModel ref={boxRoot} params={box} fold={fold} textures={textures} />
  );
}
