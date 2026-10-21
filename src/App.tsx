import { useControls } from "leva";
import { Viewer } from "./features/viewer/Viewer";
import { BoxModel } from "./features/box/BoxModel";
import { useFaceTextures } from "./features/print/useFaceTextures";
import { useImage } from "./features/print/useImage";
import type {
  BoxParams,
  Design,
  PrintProcess,
  Substrate,
} from "./features/box/types";

export default function App() {
  const params = useControls("Boîte", {
    length: { value: 300, min: 100, max: 600, step: 5 },
    width: { value: 200, min: 80, max: 400, step: 5 },
    height: { value: 100, min: 30, max: 300, step: 5 },
    flute: { value: "E", options: ["E", "B"] },
    fold: { value: 1, min: 0, max: 1, step: 0.01 },
  }) as BoxParams;

  const look = useControls("Design", {
    substrate: { value: "kraft", options: ["kraft", "white"] },
    process: { value: "flexo", options: ["flexo", "offset"] },
    inkColor: "#245a35",
    brand: "Dar Zitoun",
    logo: { image: undefined },
    logoScale: { value: 55, min: 20, max: 90, step: 1 },
  });

  const logo = useImage(look.logo);

  const design: Design = {
    substrate: look.substrate as Substrate,
    process: look.process as PrintProcess,
    inkColor: look.inkColor,
    brand: look.brand,
    logo,
    logoScale: look.logoScale,
  };

  const textures = useFaceTextures(params, design);

  return (
    <div className="w-full h-full bg-stone-200">
      <Viewer>
        <BoxModel params={params} textures={textures} />
      </Viewer>
    </div>
  );
}
