import mongoose from "mongoose";

export const connectMongoDB = async () => {
	try {
		const mongoUri = process.env.MONGODB_URI;

		if (!mongoUri) {
			throw new Error(
				"MONGODB_URI is not defined in the environment variables."
			);
		}

		const connect = await mongoose.connect(mongoUri);
		console.log(`Connected to MongoDB @: ${connect.connection.host}`);
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error connecting to MongoDB: ${error.message}`);
		} else {
			console.error(`Unknown error: ${error}`);
		}
		process.exit(1);
	}
};
