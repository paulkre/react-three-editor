import React from "react";
import { saveAs } from "file-saver";

import { useStore } from "../../state";

import { Heading } from ".";

function base64ToBlob(b64Data: string, contentType = "", sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

export const RenderSettings: React.FC = () => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [canvas, frame, setFrame] = useStore((state) => [
    state.canvas,
    state.frame,
    state.setFrame,
  ]);

  React.useEffect(() => {
    if (!canvas) return;
    const button = ref.current!;

    function startRender() {
      setFrame(0);

      setTimeout(() => {
        const data = canvas!
          .toDataURL("image/png")
          .replace(/^data:image\/png;base64,/, "");
        saveAs(
          base64ToBlob(data, "image/png"),
          `${frame.toString().padStart(5, "0")}.png`
        );
      }, 0);
    }

    button.addEventListener("click", startRender);
    return () => button.removeEventListener("click", startRender);
  }, [canvas, frame, setFrame]);

  return (
    <>
      <Heading>Render</Heading>
      <button
        className="border-2 border-gray-700 px-3 uppercase py-2 transition hover:bg-gray-700 hover:text-gray-900"
        disabled={!canvas}
        ref={ref}
      >
        Start
      </button>
    </>
  );
};
