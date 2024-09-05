import { Response } from "express";
import Notification from "../models/notification.model";

export const getNotifications = async (req: any, res: Response) => {
	try {
		const userId = req.user._id;
		const notification = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImg",
		});
		await Notification.updateMany({ to: userId }, { read: true });
		res.status(200).json(notification);
	} catch (error) {
		console.log(
			"Error in getNotification controller",
			(error as Error).message
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteNotifications = async (req: any, res: Response) => {
	try {
		const userId = req.user._id;
		await Notification.deleteMany({ to: userId });
		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log(
			"Error in deleteNotifications controller",
			(error as Error).message
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteSingleNotification = async (req: any, res: Response) => {
	try {
		const notificationId = req.params.id;
		const userId = req.user._id;
		const notification = await Notification.findById(notificationId);
		if (!notification)
			return res.status(404).json({ message: "Notification not found" });

		if (notification.to.toString() !== userId.toString())
			return res.status(403).json({
				error: "You are not allowed to perform this action",
			});

		await Notification.findByIdAndDelete(notificationId);
	} catch (error) {
		console.log(
			"Error in deleteSingleNotification controller",
			(error as Error).message
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
