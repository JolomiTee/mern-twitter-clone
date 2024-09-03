import { UserDocument } from "../models/user.model"; // Adjust the import path as needed
import { Request } from "express";

// Extend the Express namespace to include user
declare module "express-serve-static-core" {
	interface Request {
		user?: UserDocument;
		_id?: UserDocument;
	}
}
