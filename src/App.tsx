import { useControls } from "leva";
import { Viewer } from "./features/viewer/Viewer";
import { BoxModel } from "./features/box/BoxModel";
import type { BoxParams } from "./features/box/types";

export default function App() {
  const params = useControls({
    length: { value: 300, min: 100, max: 600, step: 5 },
    width: { value: 200, min: 80, max: 400, step: 5 },
    height: { value: 100, min: 30, max: 300, step: 5 },
    flute: { value: "E", options: ["E", "B"] },
    fold: { value: 1, min: 0, max: 1, step: 0.01 },
  }) as BoxParams;

  return (
    <div style={{ width: "100%", height: "100%", background: "#dfe2dc" }}>
      <Viewer>
        <BoxModel params={params} />
      </Viewer>
    </div>
  );
}
