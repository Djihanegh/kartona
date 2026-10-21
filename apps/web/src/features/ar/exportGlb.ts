import type { Object3D } from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { hingeRotation, type Hinge } from "../box/geometry";

function isHinge(data: unknown): data is Hinge {
  return (
    typeof data === "object" &&
    data !== null &&
    "hinge" in data &&
    "axis" in data
  );
}

// Plie une copie de la boîte à l'avancement voulu, sans toucher à l'affichage
function applyFold(root: Object3D, fold: number) {
  root.traverse((obj) => {
    if (isHinge(obj.userData))
      obj.rotation.set(...hingeRotation(obj.userData, fold));
  });
}

// Exporte la boîte FERMÉE au format GLB (en mètres, donc à taille réelle en AR)
export async function exportBoxGlb(root: Object3D): Promise<Blob> {
  const copy = root.clone(true);
  applyFold(copy, 1);
  copy.updateMatrixWorld(true);

  const result = await new GLTFExporter().parseAsync(copy, { binary: true });
  return new Blob([result as ArrayBuffer], { type: "model/gltf-binary" });
}
