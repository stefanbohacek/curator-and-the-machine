import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server);

import app from "./app.js";

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3000, () => {
  console.log(`app is running on port 3000...`);
});
