import { Response } from "express"; // Import Response type from Express
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

export const generateTokenAndSetCookie = (
	userId: ObjectId,
	res: Response
): void => {
	// Generate the JWT token using the user ID and secret key
	const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
		expiresIn: "15d", // Set the token to expire in 15 days
	});

	// Set the cookie with the JWT token
	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie expiry time in milliseconds (15 days)
		httpOnly: true, // Cookie is not accessible via JavaScript
		sameSite: "strict", // Protects against CSRF
		secure: process.env.NODE_ENV !== "development", // Use secure cookies in non-development environments
	});
};
