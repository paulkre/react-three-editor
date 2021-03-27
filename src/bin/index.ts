#!/usr/bin/env node

import { createServer } from "http";
import { createRenderServer } from "./render-server";

const port = 3001;

const server = createServer();
server.listen(port, () => {
  console.log(`React Three Editor server running on port ${port}`);
});

createRenderServer(server);
