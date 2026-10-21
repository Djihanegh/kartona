import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";

export function Viewer({ children }: { children: ReactNode }) {
  return (
    <Canvas shadows camera={{ position: [0.6, 0.5, 0.7], fov: 35 }}>
      <hemisphereLight args={["#ffffff", "#8d8a80", 0.9]} />
      <directionalLight position={[0.5, 1.2, 0.7]} intensity={1.2} castShadow />
      {children}
      <ContactShadows opacity={0.35} scale={2} blur={2.5} far={1} />
      <OrbitControls
        makeDefault
        target={[0, 0.04, 0]}
        maxPolarAngle={Math.PI * 0.49}
      />
    </Canvas>
  );
}
