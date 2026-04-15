import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createInvite, joinFamily } from "../controllers/inviteController.js";

const router = express.Router();

router.post("/", authMiddleware, createInvite);
router.post("/join", authMiddleware, joinFamily);

export default router;