import { Request, Response } from "express";
import User from "../models/user.model";
import Post from "../models/post.model";
import {
	v2 as cloudinary,
	UploadApiErrorResponse,
	UploadApiResponse,
} from "cloudinary";

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

export const getAllPosts = async (req: Request, res: Response) => {};

export const getFollowingPosts = async (req: Request, res: Response) => {};

export const getLikedPosts = async (req: Request, res: Response) => {};

export const getUserPosts = async (req: Request, res: Response) => {};

export const likeUnlikePost = async (req: Request, res: Response) => {};

export const commentOnPost = async (req: Request, res: Response) => {};

export const deletePost = async (req: Request, res: Response) => {};
