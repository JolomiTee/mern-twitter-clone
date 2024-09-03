import dotenv from "dotenv";
import express from "express";

import { connectMongoDB } from "./database/connect.db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRoutes);


app.listen(8000, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
