import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/documents", documentRoutes);

export default app;