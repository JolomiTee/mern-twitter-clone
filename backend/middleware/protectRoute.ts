import { NextFunction } from "express";
import User from "../models/user.model"; // Assuming you have updated this model to TypeScript
import jwt from "jsonwebtoken";

// Define a custom type for the JWT payload
interface JwtPayload {
	userId: string;
}

export const protectRoute = async (req: any, res: any, next: NextFunction) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No token provided" });
		}

		// Verify token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtPayload;

		if (!decoded || !decoded.userId) {
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		// Find user by ID and exclude password
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware", (error as Error).message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
