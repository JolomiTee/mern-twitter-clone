import express from "express";
import { getAuthenthicatedUser, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getAuthenthicatedUser)

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
