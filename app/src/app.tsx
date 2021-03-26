import React from "react";

import { Editor, useFrame } from "react-three-editor";
import type { Mesh } from "three";

const Box: React.FC = () => {
  const ref = React.useRef<Mesh>(null);

  useFrame(({ time }) => {
    const mesh = ref.current;
    console.log(mesh);
    if (!mesh) return;

    const t = Math.PI * (time / 1000);
    mesh.position.set(0, Math.sin(t), 0);
  });

  return (
    <>
      <pointLight position={[0, 3, 3]} />
      <ambientLight intensity={0.04} />
      <mesh ref={ref}>
        <sphereGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  );
};

export const App: React.FC = () => (
  <Editor>
    <Box />
  </Editor>
);
