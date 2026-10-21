import { useMemo } from "react";
import { MeshStandardMaterial, type Texture } from "three";
import type { BoxParams } from "./types";
import { thickness, flapLength, foldAngles } from "./geometry";
import type { FaceTextures } from "../print/useFaceTextures";

type Vec3 = [number, number, number];

function Panel({
  size,
  position,
  map,
  inner,
  edge,
}: {
  size: Vec3;
  position: Vec3;
  map: Texture;
  inner: MeshStandardMaterial;
  edge: MeshStandardMaterial;
}) {
  const outer = useMemo(
    () => new MeshStandardMaterial({ map, roughness: 0.9 }),
    [map],
  );
  return (
    <mesh
      position={position}
      castShadow
      receiveShadow
      material={[edge, edge, inner, outer, edge, edge]}
    >
      <boxGeometry args={size} />
    </mesh>
  );
}

export function BoxModel({
  params,
  fold,
  textures,
}: {
  params: BoxParams;
  fold: number; // 0 = à plat, 1 = fermée
  textures: FaceTextures;
}) {
  const { length: L, width: W, height: H } = params;
  const t = thickness(params);
  const F = flapLength(params);
  const a = foldAngles(fold);
  const lidLen = W + 2 * t;

  const inner = useMemo(
    () => new MeshStandardMaterial({ color: "#bb9262", roughness: 0.95 }),
    [],
  );
  const edge = useMemo(
    () => new MeshStandardMaterial({ color: "#8a6942", roughness: 1 }),
    [],
  );
  const shared = { inner, edge };

  return (
    <group scale={0.001} position={[0, (t / 2) * 0.001, 0]}>
      <Panel
        size={[L, t, W]}
        position={[0, 0, 0]}
        map={textures.bottom}
        {...shared}
      />

      <group position={[0, 0, W / 2]} rotation-x={-a.walls}>
        <Panel
          size={[L, t, H]}
          position={[0, 0, H / 2]}
          map={textures.front}
          {...shared}
        />
      </group>

      <group position={[0, 0, -W / 2]} rotation-x={a.walls}>
        <Panel
          size={[L, t, H]}
          position={[0, 0, -H / 2]}
          map={textures.back}
          {...shared}
        />
        <group position={[0, 0, -H]} rotation-x={a.lid}>
          <Panel
            size={[L, t, lidLen]}
            position={[0, 0, -lidLen / 2]}
            map={textures.lid}
            {...shared}
          />
          <group position={[0, 0, -lidLen]} rotation-x={a.flap}>
            <Panel
              size={[L, t, F]}
              position={[0, 0, -F / 2]}
              map={textures.flap}
              {...shared}
            />
          </group>
        </group>
      </group>

      <group position={[L / 2, 0, 0]} rotation-z={a.walls}>
        <Panel
          size={[H, t, W]}
          position={[H / 2, 0, 0]}
          map={textures.right}
          {...shared}
        />
      </group>
      <group position={[-L / 2, 0, 0]} rotation-z={-a.walls}>
        <Panel
          size={[H, t, W]}
          position={[-H / 2, 0, 0]}
          map={textures.left}
          {...shared}
        />
      </group>
    </group>
  );
}
