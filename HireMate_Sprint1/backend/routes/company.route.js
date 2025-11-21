import express from "express";
import {
  registerCompany,
  getAllCompanies,
  getCompanyById,
} from "../controllers/company.controller.js";

const router = express.Router();

// POST /api/company/register - Company Registration (HM-02)
router.post("/register", registerCompany);

// GET /api/company - Get All Companies
router.get("/", getAllCompanies);

// GET /api/company/:id - Get Company by ID
router.get("/:id", getCompanyById);

export default router;

