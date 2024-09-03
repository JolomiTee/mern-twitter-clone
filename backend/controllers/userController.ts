import { Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";

export const getUserProfile = async (req: any, res: Response) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username }).select("-password");
		if (!user) return res.status(404).json({ error: "USer not found" });
	} catch (error) {
		console.log("Error in getUserProfile controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const followUnfollowUser = async (req: any, res: Response) => {
	try {
		const { id } = req.params;
		const currentUserId = req.user._id.toString();

		if (id === currentUserId) {
			return res
				.status(400)
				.json({ error: "You can't follow/unfollow yourself" });
		}

		// Fetch both users
		const [userToModify, currentUser] = await Promise.all([
			User.findById(id),
			User.findById(currentUserId),
		]);

		if (!userToModify || !currentUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Convert ObjectId to string for comparison
		const isFollowing = currentUser.following.some(
			(followingId) => followingId.toString() === id.toString()
		);

		if (!isFollowing) {
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// send follow notification
			res.status(200).json({ message: `${id} just followed you` });
		} else {
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: `${id} just unfollowed you` });
		}
	} catch (error) {
		console.log("Error in followUnfollow controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
