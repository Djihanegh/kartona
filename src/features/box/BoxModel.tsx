import { useMemo, type Ref } from "react";
import { MeshStandardMaterial, type Group, type Texture } from "three";
import type { BoxParams } from "./types";
import { thickness, flapLength, HINGES, hingeRotation } from "./geometry";
import type { FaceTextures } from "../print/useFaceTextures";

type Vec3 = [number, number, number];

// Ordre des faces d'une BoxGeometry : +x, -x, +y, -y, +z, -z
// -y = extérieur imprimé, +y = intérieur brun, le reste = tranche du carton
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

interface BoxModelProps {
  params: BoxParams;
  fold: number; // 0 = à plat, 1 = fermée
  textures: FaceTextures;
  ref?: Ref<Group>;
}

export function BoxModel({ params, fold, textures, ref }: BoxModelProps) {
  const { length: L, width: W, height: H } = params;
  const t = thickness(params);
  const F = flapLength(params);
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

  // Rotation + description de chaque charnière
  const hinge = (name: keyof typeof HINGES) => ({
    rotation: hingeRotation(HINGES[name], fold),
    userData: HINGES[name],
  });

  return (
    <group ref={ref} scale={0.001} position={[0, (t / 2) * 0.001, 0]}>
      <Panel
        size={[L, t, W]}
        position={[0, 0, 0]}
        map={textures.bottom}
        {...shared}
      />

      <group position={[0, 0, W / 2]} {...hinge("front")}>
        <Panel
          size={[L, t, H]}
          position={[0, 0, H / 2]}
          map={textures.front}
          {...shared}
        />
      </group>

      <group position={[0, 0, -W / 2]} {...hinge("back")}>
        <Panel
          size={[L, t, H]}
          position={[0, 0, -H / 2]}
          map={textures.back}
          {...shared}
        />
        <group position={[0, 0, -H]} {...hinge("lid")}>
          <Panel
            size={[L, t, lidLen]}
            position={[0, 0, -lidLen / 2]}
            map={textures.lid}
            {...shared}
          />
          <group position={[0, 0, -lidLen]} {...hinge("flap")}>
            <Panel
              size={[L, t, F]}
              position={[0, 0, -F / 2]}
              map={textures.flap}
              {...shared}
            />
          </group>
        </group>
      </group>

      <group position={[L / 2, 0, 0]} {...hinge("right")}>
        <Panel
          size={[H, t, W]}
          position={[H / 2, 0, 0]}
          map={textures.right}
          {...shared}
        />
      </group>
      <group position={[-L / 2, 0, 0]} {...hinge("left")}>
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
