import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

const app = express();
const httpserver = createServer(app);


app.use(express.static("public"));
const io = new Server(httpserver, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const ySocket = new YSocketIO(io);
ySocket.initialize();


// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "hello world",
//     success: true,
//   });
// });

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is healthy",
    success: true,
  });
});

httpserver.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});