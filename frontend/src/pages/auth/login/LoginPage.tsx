import { useState } from "react";
import { Link } from "react-router-dom";

import { MdOutlineMail, MdPassword } from "react-icons/md";

import {
	useMutation,
	UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import XSvg from "../../../components/svgs/X";

interface LoginData {
	username: string;
	password: string;
}

interface LoginResponse {
	[key: string]: any;
}

const useLoginMutation = (): UseMutationResult<
	LoginResponse,
	Error,
	LoginData
> => {
	const queryClient = useQueryClient();

	return useMutation<LoginResponse, Error, LoginData>({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				if (!res.ok) {
					// Parse the error message if possible
					const errorData = await res.json();
					throw new Error(errorData.error || "Error during login");
				}

				const data: LoginResponse = await res.json();
				return data; // This resolves to the expected response type
			} catch (error) {
				// Type narrowing for better error handling
				if (error instanceof Error) {
					throw new Error(error.message);
				} else {
					throw new Error("An unknown error occurred.");
				}
			}
		},
		onSuccess() {
			toast.success("Logged in successfully");
			// refetch auth user to update UI
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});
};

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const { mutate: login, isError, isPending, error } = useLoginMutation();

	const handleSubmit = (e: any) => {
		e.preventDefault();
		login(formData);
	};

	const handleInputChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	return (
		<div className="max-w-screen-xl mx-auto flex h-screen">
			<div className="flex-1 hidden lg:flex items-center  justify-center">
				<XSvg className="lg:w-2/3 fill-white" />
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
					<XSvg className="w-24 lg:hidden fill-white" />
					<h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
					<label className="input input-bordered rounded flex items-center gap-2">
						<MdOutlineMail />
						<input
							type="text"
							className="grow"
							placeholder="username"
							name="username"
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className="input input-bordered rounded flex items-center gap-2">
						<MdPassword />
						<input
							type="password"
							className="grow"
							placeholder="Password"
							name="password"
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className="btn rounded-full btn-primary text-white">
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</form>
				<div className="flex flex-col gap-2 mt-4">
					<p className="text-white text-lg">{"Don't"} have an account?</p>
					<Link to="/signup">
						<button className="btn rounded-full btn-primary text-white btn-outline w-full">
							Sign up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
