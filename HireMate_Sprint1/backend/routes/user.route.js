import express from "express";
import { register, login, logout } from "../controllers/user.controller.js";

const router = express.Router();

// POST /api/register - User Registration (HM-01)
router.post("/", register);

// POST /api/register/login - User Login
router.post("/login", login);

// POST /api/register/logout - User Logout
router.post("/logout", logout);

export default router;

