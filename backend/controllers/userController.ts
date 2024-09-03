import { Request, Response } from "express";
import User from "../models/user.model";
import Notification from "../models/notification.model";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

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
			const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});

			await newNotification.save();
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

export const getSuggestedUser = async (req: any, res: Response) => {
	try {
		const userId = req.user._id;

		const userFollowedByMe = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);

		const filteredUsers = users.filter(
			(user) => !userFollowedByMe?.following.includes(user._id)
		);
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));
		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in suggestedUsers controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateUserProfile = async (req: any, res: Response) => {
	const { fullName, email, username, currentPassword, newPassword, bio, link } =
		req.body;
	let { profileImage, coverImage } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "USer not found" });

		if (
			(!newPassword && currentPassword) ||
			(!currentPassword && newPassword)
		) {
			return res.status(400).json({
				error: "Please provide both current password and new password",
			});
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(
				currentPassword,
				user.password || ""
			);
			if (!isMatch)
				return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6)
				return res
					.status(400)
					.json({ error: "Password must be at least 6 characters long" });
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImage) {
			if (user.profileImg) {
				const publicId = user.profileImg.split("/").pop()?.split(".")[0];

				if (publicId) {
					await cloudinary.uploader.destroy(publicId);
				} else {
					res.status(400).json({
						error: "Public ID could not be determined for the profile image.",
					});
				}
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImage);
			profileImage = uploadedResponse.secure_url;
		}

		if (coverImage) {
			if (user.coverImg) {
				const publicId = user.coverImg.split("/").pop()?.split(".")[0];

				if (publicId) {
					await cloudinary.uploader.destroy(publicId);
				} else {
					res.status(400).json({
						error: "Public ID could not be determined for the cover image.",
					});
				}
			}
			const uploadedResponse = await cloudinary.uploader.upload(coverImage);
			coverImage = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImage || user.profileImg;
		user.coverImg = coverImage || user.coverImg;

		const updatedUser = await user.save();

		updatedUser.password = "";

		return res.status(200).json(updatedUser);
	} catch (error) {
		console.log(
			"Error in updateUserProfile controller",
			(error as Error).message
		);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
