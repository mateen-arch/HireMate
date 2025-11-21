import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
} from "../controllers/job.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/jobs - Post Job (HM-03) - Protected route
router.post("/", authenticateToken, postJob);

// GET /api/jobs - Get All Jobs with Search and Filter (HM-04, HM-25)
router.get("/", getAllJobs);

// GET /api/jobs/:id - Get Job by ID (HM-24)
router.get("/:id", getJobById);

export default router;

