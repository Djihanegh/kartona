import type { BoxParams } from "./types";
import { thickness, flapLength, foldAngles } from "./geometry";

const KRAFT = "#b38956";

type Vec3 = [number, number, number];

function Panel({ size, position }: { size: Vec3; position: Vec3 }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={KRAFT} roughness={0.9} />
    </mesh>
  );
}

export function BoxModel({ params }: { params: BoxParams }) {
  const { length: L, width: W, height: H } = params;
  const t = thickness(params);
  const F = flapLength(params);
  const a = foldAngles(params.fold);
  const lidLen = W + 2 * t;

  return (
    // Les mm sont convertis en mètres : indispensable pour l'AR à taille réelle
    <group scale={0.001} position={[0, (t / 2) * 0.001, 0]}>
      {/* Fond */}
      <Panel size={[L, t, W]} position={[0, 0, 0]} />

      {/* Face avant */}
      <group position={[0, 0, W / 2]} rotation-x={-a.walls}>
        <Panel size={[L, t, H]} position={[0, 0, H / 2]} />
      </group>

      {/* Face arrière, puis couvercle et rabat */}
      <group position={[0, 0, -W / 2]} rotation-x={a.walls}>
        <Panel size={[L, t, H]} position={[0, 0, -H / 2]} />
        <group position={[0, 0, -H]} rotation-x={a.lid}>
          <Panel size={[L, t, lidLen]} position={[0, 0, -lidLen / 2]} />
          <group position={[0, 0, -lidLen]} rotation-x={a.flap}>
            <Panel size={[L, t, F]} position={[0, 0, -F / 2]} />
          </group>
        </group>
      </group>

      {/* Côtés */}
      <group position={[L / 2, 0, 0]} rotation-z={a.walls}>
        <Panel size={[H, t, W]} position={[H / 2, 0, 0]} />
      </group>
      <group position={[-L / 2, 0, 0]} rotation-z={-a.walls}>
        <Panel size={[H, t, W]} position={[-H / 2, 0, 0]} />
      </group>
    </group>
  );
}
