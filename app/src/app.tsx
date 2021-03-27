import React from "react";

import { Editor, useFrame } from "react-three-editor";
import { Color, Material, Mesh, MeshBasicMaterial } from "three";

const Box: React.FC = () => {
  const ref = React.useRef<Mesh>(null);

  // useFrame(({ time }) => {
  //   const mesh = ref.current;
  //   if (!mesh) return;

  //   const t = Math.PI * (time / 1000);
  //   mesh.position.set(0, Math.sin(t), 0);
  // });

  useFrame(({ frame }) => {
    const mesh = ref.current;
    if (!mesh) return;

    (mesh.material as MeshBasicMaterial).color = new Color(
      frame % 2 === 0 ? "red" : "blue"
    );
  });

  return (
    <>
      {/* <pointLight position={[0, 3, 3]} />
      <ambientLight intensity={0.04} />
      <mesh ref={ref}>
        <sphereGeometry />
        <meshStandardMaterial />
      </mesh> */}
      <mesh ref={ref}>
        <boxGeometry />
        <meshBasicMaterial />
      </mesh>
    </>
  );
};

export const App: React.FC = () => (
  <Editor>
    <Box />
  </Editor>
);
