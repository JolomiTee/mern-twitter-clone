import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
	getAuthenthicatedUser,
	login,
	logout,
	signup,
} from "../controllers/authController";

const router = express.Router();

router.get("/me", protectRoute, getAuthenthicatedUser);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
