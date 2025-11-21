import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  submitApplication,
  getQualifiedApplications,
  getMyApplications,
  updateApplicationStatus,
  getTopCandidates,
} from "../controllers/application.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_UPLOAD_PATH = path.join(__dirname, "..", "uploads", "cvs");
const CV_UPLOAD_PATH = process.env.CV_UPLOAD_PATH
  ? path.resolve(process.env.CV_UPLOAD_PATH)
  : DEFAULT_UPLOAD_PATH;

if (!fs.existsSync(CV_UPLOAD_PATH)) {
  fs.mkdirSync(CV_UPLOAD_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, CV_UPLOAD_PATH);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    cb(null, `cv_${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedExtensions = [".pdf", ".docx"];
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error("Invalid file type. Only PDF and DOCX files are allowed.")
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const uploadMiddleware = (req, res, next) => {
  upload.single("cv")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to upload CV",
      });
    }
    next();
  });
};

router.post("/submit", authenticateToken, uploadMiddleware, submitApplication);

router.get(
  "/qualified/:job_id",
  authenticateToken,
  getQualifiedApplications
);

router.get("/me", authenticateToken, getMyApplications);

router.put(
  "/status/:application_id",
  authenticateToken,
  updateApplicationStatus
);

router.get(
  "/top-candidates/:job_id",
  authenticateToken,
  getTopCandidates
);

export default router;


