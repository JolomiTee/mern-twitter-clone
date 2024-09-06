import {
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { BsEmojiSmileFill } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";

interface CreatePostResponse {
	[key: string]: any;
}

interface CreatePostData {
	[key: string]: any;
}

interface AuthUser {
	_id: string;
	username: string;
	fullName: string;
	email: string;
	followers: string[]; // Array of user IDs who follow this user
	following: string[]; // Array of user IDs this user is following
	profileImg: string; // URL or path to profile image
	coverImg: string; // URL or path to cover image
	bio: string; // User's biography or description
	link: string; // Link to external website or social media
	likedPosts: string[]; // Array of liked post IDs
}

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState<string | ArrayBuffer | null>(null); // File or null
	const imgRef = useRef<HTMLInputElement | null>(null);

	const { data: authUser } = useQuery<AuthUser>({ queryKey: ["authUser"] });

	const useCreatePostMutation = (): UseMutationResult<
		CreatePostResponse,
		Error,
		CreatePostData
	> => {
		const queryClient = useQueryClient();
		return useMutation<CreatePostResponse, Error, CreatePostData>({
			mutationFn: async ({ text, img }) => {
				try {
					const res = await fetch("/api/posts/create", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ text, img }),
					});

					if (!res.ok) {
						const errorData = await res.json();
						throw new Error(errorData.error || "Could not create post");
					}

					const data: CreatePostResponse = await res.json();
					return data; // This resolves to the expected response type
				} catch (error) {
					if (error instanceof Error) {
						throw new Error(error.message);
					} else {
						throw new Error("An unknown error occurred.");
					}
				}
			},
			onSuccess() {
				setText("");
				setImg(null);
				toast.success("Post Created");
				queryClient.invalidateQueries({ queryKey: ["authUser"] });
			},
			onError(error) {
				toast.error(error.message);
			},
		});
	};

	const {
		mutate: createPost,
		isError,
		isPending,
		error,
	} = useCreatePostMutation();

	const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; // `files` can be null, so use optional chaining
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result); // Type assertion since `reader.result` can be `string | ArrayBuffer | null`
			};
			reader.readAsDataURL(file);
		}
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createPost({ text, img });
	};

	return (
		<div className="flex p-4 items-start gap-4 border-b border-gray-700">
			<div className="avatar">
				<div className="w-8 rounded-full">
					<img
						src={authUser?.profileImg || "/avatar-placeholder.png"}
						alt="Avatar"
					/>
				</div>
			</div>
			<form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
				<textarea
					className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
					placeholder="What is happening?!"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className="relative w-72 mx-auto">
						<IoCloseSharp
							className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
							onClick={() => {
								setImg(null); // Remove the image
								if (imgRef.current) {
									imgRef.current.value = ""; // Clear file input
								}
							}}
						/>
						<img
							src={img as string} // Create a preview of the image
							className="w-full mx-auto h-72 object-contain rounded"
							alt="Post image"
						/>
					</div>
				)}

				<div className="flex justify-between border-t py-2 border-t-gray-700">
					<div className="flex gap-1 items-center">
						<CiImageOn
							className="fill-primary w-6 h-6 cursor-pointer"
							onClick={() => imgRef.current?.click()}
						/>
						<BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
					</div>
					<input
						type="file"
						accept="image/*"
						hidden
						ref={imgRef}
						onChange={handleImgChange}
					/>
					<button
						className="btn btn-primary rounded-full btn-sm text-white px-4"
						type="submit"
					>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className="text-red-500">{error?.message}</div>}
			</form>
		</div>
	);
};

export default CreatePost;
