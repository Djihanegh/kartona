import { folder, useControls } from "leva";
import { Viewer } from "./features/viewer/Viewer";
import { BoxModel } from "./features/box/BoxModel";
import type { BoxParams, Design } from "./features/box/types";
import { useFaceTextures } from "./features/print/useFaceTextures";

export default function App() {
  const params = useControls("Boîte", {
    length: { value: 300, min: 100, max: 600, step: 5 },
    width: { value: 200, min: 80, max: 400, step: 5 },
    height: { value: 100, min: 30, max: 300, step: 5 },
    flute: { value: "E", options: ["E", "B"] },
    fold: { value: 1, min: 0, max: 1, step: 0.01 },
  }) as BoxParams;

  const design = useControls("Design", {
    impression: folder({
      substrate: { value: "kraft", options: ["kraft", "white"] },
      brand: "Dar Zitoun",
      inkColor: "#245a35",
    }),
  }) as Design;

  const textures = useFaceTextures(params, design);
  return (
    <div className="w-full h-full bg-stone-200">
      <Viewer>
        <BoxModel params={params} textures={textures} />
      </Viewer>
    </div>
  );
}
