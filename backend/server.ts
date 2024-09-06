import dotenv from "dotenv";
import path from "path";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import notificationRoutes from "./routes/notification.routes";

import { connectMongoDB } from "./database/connectDb";

dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUDNAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(
			path.resolve(__dirname, "..", "..", "frontend", "dist", "index.html")
		);
	});
}

app.listen(8000, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
