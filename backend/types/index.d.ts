declare global {
	namespace Express {
		export interface Request {
			user?: {}; // Optional, in case not every request has a user
		}
	}
}
