import { Request, Response } from "express";
import User from "../models/user.model";
import Post from "../models/post.model";
import {
	v2 as cloudinary,
	UploadApiErrorResponse,
	UploadApiResponse,
} from "cloudinary";
import Notification from "../models/notification.model";

export const createPost = async (req: any, res: Response) => {
	try {
		const { text } = req.body;
		let { img } = req.body;

		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.json(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or an image" });
		}

		if (img) {
			try {
				// Type the response to ensure it matches the Cloudinary API response types
				const uploadedResponse: UploadApiResponse =
					await cloudinary.uploader.upload(img);
				img = uploadedResponse.secure_url;
			} catch (error) {
				// Use explicit type assertion for the error
				const uploadError = error as UploadApiErrorResponse;
				console.error("Cloudinary upload error:", uploadError.message);
				// Handle the error, e.g., set an error state or return an error response
			}
		}

		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		console.log("Error in createPost controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getAllPosts = async (req: Request, res: Response) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comment.user",
				select: "-password",
			});
		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {}
};

export const getFollowingPosts = async (req: Request, res: Response) => {};

export const getLikedPosts = async (req: Request, res: Response) => {};

export const getUserPosts = async (req: Request, res: Response) => {};

export const likeUnlikePost = async (req: Request, res: Response) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			//unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
			res.sendStatus(200).json({ message: "Post liked successfully" });
		} else {
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

			await post.save();

			const notification = new Notification({
				from: "userId",
				to: post.user,
				type: "like",
			});

			await notification.save();

			res.status(200).json({ message: "Post liked succcessfully" });
		}
	} catch (error) {
		console.log("Error in likeUnlike controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const commentOnPost = async (req: any, res: Response) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };
		post.comments.push(comment);
		await post.save();

		res.status(200).json({ post });
	} catch (error) {
		console.log("Error in commentOnPost controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deletePost = async (req: any, res: Response) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You cannot delete this post" });
		}

		if (post.img) {
			const publicId = post.img.split("/").pop()?.split(".")[0];
			if (publicId) {
				await cloudinary.uploader.destroy(publicId);
			} else {
				res.status(400).json({
					error: "Public ID could not be determined for the post image(s).",
				});
			}
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted sucesfully" });
	} catch (error) {
		console.log("Error in deletePost controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
