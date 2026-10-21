import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import type { FaceId } from "../box/types";
import type { FaceCanvases } from "./useFaceCanvases";
export type FaceTextures = Record<FaceId, CanvasTexture>;

// Transforme les visuels en textures pour la scène 3D
export function useFaceTextures(canvases: FaceCanvases): FaceTextures {
  const textures = useMemo(() => {
    const out = {} as FaceTextures;
    for (const id of Object.keys(canvases) as FaceId[]) {
      const tex = new CanvasTexture(canvases[id]);
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = 8;
      out[id] = tex;
    }
    return out;
  }, [canvases]);

  useEffect(
    () => () => Object.values(textures).forEach((t) => t.dispose()),
    [textures],
  );

  return textures;
}
