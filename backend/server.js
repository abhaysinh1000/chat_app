// ── MUST BE FIRST LINE — loads env before any imports execute ──
import "dotenv/config";

// Socket config
import http from "http";
import { Server } from "socket.io";

import express from "express";

import cors from "cors";
import helmet from "helmet";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import mainRoute from "./routes/routes.js";
import mongoose from "mongoose";
import socketHandler from "./sockets/index.js";
import socketAuthMiddleware from "./middleware/socketAuth.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 1000;

// Socket Config

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
io.use(socketAuthMiddleware);
socketHandler(io);

// ── Middlewares ──────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// ── Routes ───────────────────────────────
app.get("/", (req, res) => {
  res.send("server is live");
});

app.use("/api", mainRoute);

// global error handler always last
app.use(globalErrorHandler);

// ── Database + Server Start ───────────────────────────────────

const start = async () => {
  await connectDb();
  server.listen(PORT, () => {
    //not app use the server
    console.log(`app is running on the port ${PORT}`);
  });
};

start();

// ── Graceful Shutdown ────────────────────
const ShutDown = async (signal) => {
  console.log(`received ${signal} graceful shutdown started`);

  server.close(async () => {
    console.log(`http server closed`);
    try {
      await mongoose.connection.close();
      console.log(`database connection closed`);
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.log(`force shut down after timeout`);
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", ShutDown);
process.on("SIGTERM", ShutDown);

process.on("uncaughtException", (err) => {
  console.error("uncaught Exception", err);
  ShutDown("uncaughtException");
});

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection", err);
  ShutDown("unhandledRejection");
});
