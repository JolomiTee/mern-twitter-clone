import mongoose from "mongoose";

export const connectMongoDB = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`Connected to MongoDB @: ${connect.connection.host}`);
	} catch (error) {
		console.error(`Error connection to MongoDB: ${error.message}`);
		process.exit(1);
	}
};
