import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { IPost } from "../../types";
import PostSkeleton from "../skeletons/PostSkeleton";
import Post from "./Post";

interface PostsProps {
	feedType: "forYou" | "following" | "posts" | "likes";
	username?: string;
	userId?: string;
}

const Posts = ({ feedType, username, userId }: PostsProps) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery<IPost[]>({
		queryKey: ["posts", feedType, username, userId],
		queryFn: async () => {
			const res = await fetch(POST_ENDPOINT);
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			return data;
		},
	});

	// Refetch posts when feedType or username changes
	useEffect(() => {
		refetch();
	}, [feedType, username, refetch]);

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className="flex flex-col justify-center">
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className="text-center my-4">No posts in this tab. Switch 👻</p>
			)}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

export default Posts;
