import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  scheduleInterview,
  getInterviewQuestions,
  submitInterviewAnswer,
  completeInterview,
  getInterviewResults,
  getInterviewByApplication,
  completeInterviewExternal,
} from "../controllers/interview.controller.js";

const router = express.Router();

router.post(
  "/schedule/:application_id",
  authenticateToken,
  scheduleInterview
);

router.get(
  "/questions/:interview_id",
  authenticateToken,
  getInterviewQuestions
);

router.post("/submit-answer", authenticateToken, submitInterviewAnswer);

router.post(
  "/complete/:interview_id",
  authenticateToken,
  completeInterview
);

router.get(
  "/results/:interview_id",
  authenticateToken,
  getInterviewResults
);

router.get(
  "/by-application/:application_id",
  authenticateToken,
  getInterviewByApplication
);

router.post("/external/complete", completeInterviewExternal);

export default router;


