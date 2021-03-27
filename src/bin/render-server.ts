import { resolve as resolvePath, dirname } from "path";
import { Server } from "http";
import { Server as WSS } from "ws";
import { promises as fs } from "fs";
import mkdirp from "mkdirp";

const { writeFile } = fs;

type FrameData = { path: string; data: string };

export function createRenderServer(server: Server) {
  const wss = new WSS({ server });

  wss.on("connection", (socket) => {
    socket.on("message", async (msg) => {
      const { path, data } = JSON.parse(msg.toString()) as FrameData;
      const absPath = resolvePath(path);
      const dir = dirname(absPath);
      await mkdirp(dir);
      await writeFile(absPath, data, {
        encoding: "base64",
      });
      socket.send(`Frame saved to ${absPath}`);
    });
  });
}
