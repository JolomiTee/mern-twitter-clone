import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
	deleteNotifications,
	deleteSingleNotification,
	getNotifications,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteSingleNotification);
export default router;
