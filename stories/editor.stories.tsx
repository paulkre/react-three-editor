import React from "react";
import { Meta, Story } from "@storybook/react";
import { Editor } from "../src/components/editor";

import { useFrame } from "../src/components/frame-provider";
import type { Mesh } from "three";

const Sketch: React.FC = () => {
  const ref = React.useRef<Mesh>(null);

  useFrame(({ time }) => {
    const mesh = ref.current;
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

const Component: Story = () => (
  <Editor>
    <Sketch />
  </Editor>
);

const meta: Meta = {
  title: "Editor",
  component: Component,
};

export default meta;

export const Default = Component.bind({});
