import dotenv from "dotenv";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { connectMongoDB } from "./database/connectDb";
import authRoutes from "./routes/auth.routes";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(8000, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
