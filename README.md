# React Three Editor

Visual editor for creating animations with React Three Fiber.

## Usage

```jsx
import React from "react";
import ReactDOM from "react-dom";

import { Editor, useFrame } from "react-three-editor";

const Box = () => {
  const ref = React.useRef(null);

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

ReactDOM.render(
  <React.StrictMode>
    <Editor>
      <Box />
    </Editor>
  </React.StrictMode>,
  document.getElementById("root")
);
```
