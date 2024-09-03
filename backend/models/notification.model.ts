import mongoose, { ObjectId } from "mongoose";

export interface INotification {
	from: ObjectId;
	to: ObjectId;
	type: string;
	read: boolean;
}

const notificationSchema = new mongoose.Schema<INotification>({
	from: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: ["follow", "like"],
	},
	read: {
		type: Boolean,
		default: false,
	},
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
