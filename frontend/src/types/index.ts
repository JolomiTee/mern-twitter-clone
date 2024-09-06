export interface IUser {
	_id: string;
	username: string;
	fullName: string;
	email: string;
	followers: string[]; // Array of user IDs
	following: string[]; // Array of user IDs
	profileImg: string; // Image URL or empty string
	coverImg: string; // Image URL or empty string
	bio: string;
	link: string; // URL or empty string
	likedPosts: string[]; // Array of post IDs
	createdAt: string; // ISO string
	updatedAt: string; // ISO string
	__v: number; // Version key
}

export interface IComment {
	_id: string;
	text: string;
	user: IUser; // User object for the commenter
}

export interface IPost {
	_id: string;
	user: IUser; // User object for the post owner
	text: string;
	img: string | null; // Image URL or null
	likes: string[]; // Array of user IDs who liked the post
	comments: IComment[]; // Array of comments
	createdAt: string; // ISO string
	updatedAt: string; // ISO string
	__v: number; // Version key
}


export interface IProfile {
	_id: string;
	username: string;
	fullName: string;
	email: string;
	followers: string[]; // Array of strings representing followers
	following: string[]; // Array of strings representing users being followed
	profileImg: string; // URL or path to the profile image
	coverImg: string; // URL or path to the cover image
	bio: string; // User's bio
	link: string; // Optional link, such as personal website or social profile
	likedPosts: string[]; // Array of strings representing liked posts
	createdAt: Date; // Date of account creation
	updatedAt: Date; // Date of last profile update
	__v: number; // Version key (used by MongoDB)
}
