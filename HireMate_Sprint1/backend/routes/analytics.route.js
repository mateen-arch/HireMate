import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getHiringPipeline } from "../controllers/application.controller.js";

const router = express.Router();

router.get(
  "/hiring-pipeline/:job_id",
  authenticateToken,
  getHiringPipeline
);

export default router;



