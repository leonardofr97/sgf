import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../config/upload.js";
import {
  uploadDocument,
  getDocuments,
  deleteDocument
} from "../controllers/documentController.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), uploadDocument);
router.get("/", authMiddleware, getDocuments);
router.delete("/:id", authMiddleware, deleteDocument);

export default router;