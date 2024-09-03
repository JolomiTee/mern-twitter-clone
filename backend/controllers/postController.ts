import { Request, Response } from "express";
import User from "../models/user.model";
import Post from "../models/post.model";
import bcrypt from "bcryptjs";

export const getAllPosts = async (req: Request, res: Response) => {};

export const getFollowingPosts = async (req: Request, res: Response) => {};

export const getLikedPosts = async (req: Request, res: Response) => {};

export const getUserPosts = async (req: Request, res: Response) => {};

export const createPost = async (req: Request, res: Response) => {};

export const likeUnlikePost = async (req: Request, res: Response) => {};

export const commentOnPost = async (req: Request, res: Response) => {};

export const deletePost = async (req: Request, res: Response) => {};
