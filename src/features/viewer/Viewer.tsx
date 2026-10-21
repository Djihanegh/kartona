import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, ContactShadows, OrbitControls } from "@react-three/drei";

export function Viewer({ children }: { children: ReactNode }) {
  return (
    <Canvas shadows camera={{ position: [0.6, 0.5, 0.7], fov: 35 }}>
      <hemisphereLight args={["#ffffff", "#8d8a80", 0.9]} />
      <directionalLight
        position={[0.5, 1.2, 0.7]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-0.6}
        shadow-camera-right={0.6}
        shadow-camera-top={0.6}
        shadow-camera-bottom={-0.6}
        shadow-camera-near={0.1}
        shadow-camera-far={3}
        shadow-bias={-0.0002}
        shadow-normalBias={0.002}
      />

      {/* Cadre la caméra sur la boîte au chargement et quand l'écran change de taille */}
      <Bounds fit clip observe margin={1.4}>
        {children}
      </Bounds>

      <ContactShadows opacity={0.35} scale={2} blur={2.5} far={1} />
      <OrbitControls makeDefault maxPolarAngle={Math.PI * 0.49} />
    </Canvas>
  );
}
