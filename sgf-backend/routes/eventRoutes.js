import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", authMiddleware, createEvent);
router.get("/", authMiddleware, getEvents);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;