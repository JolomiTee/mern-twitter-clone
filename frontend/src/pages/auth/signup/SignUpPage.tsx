import { Link } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import toast from "react-hot-toast";
import XSvg from "../../../components/svgs/X";

interface SignUpData {
	email: string;
	username: string;
	password: string;
	fullName: string;
}

interface SignUpResponse {
	[key: string]: any;
}

const useSignUpMutation = (): UseMutationResult<
	SignUpResponse,
	Error,
	SignUpData
> => {
	return useMutation<SignUpResponse, Error, SignUpData>({
		mutationFn: async ({ email, username, password, fullName }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, password, fullName }),
				});

				if (!res.ok) {
					// Parse the error message if possible
					const errorData = await res.json();
					throw new Error(errorData.error || "Error during sign-up");
				}

				const data: SignUpResponse = await res.json();
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
			toast.success("User created successfully");
		},
	});
};

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const { mutate, isError, isPending, error } = useSignUpMutation();

	const handleInputChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: any) => {
		e.preventDefault(); // page won't reload
		mutate(formData);
	};
	return (
		<div className="max-w-screen-xl mx-auto flex h-screen px-10">
			<div className="flex-1 hidden lg:flex items-center  justify-center">
				<XSvg className="lg:w-2/3 fill-white" />
			</div>
			<div className="flex-1 flex flex-col justify-center items-center">
				<form
					className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
					onSubmit={handleSubmit}
				>
					<XSvg className="w-24 lg:hidden fill-white" />
					<h1 className="text-4xl font-extrabold text-white">Join today.</h1>
					<label className="input input-bordered rounded flex items-center gap-2">
						<MdOutlineMail />
						<input
							type="email"
							className="grow"
							placeholder="Email"
							name="email"
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className="flex gap-4 flex-wrap">
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
							<FaUser />
							<input
								type="text"
								className="grow "
								placeholder="Username"
								name="username"
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className="input input-bordered rounded flex items-center gap-2 flex-1">
							<MdDriveFileRenameOutline />
							<input
								type="text"
								className="grow"
								placeholder="Full Name"
								name="fullName"
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
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
						{isPending ? "Loading..." : "Sign up"}
					</button>
					{isError && <p className="text-red-500">{error.message}</p>}
				</form>
				<div className="flex flex-col lg:w-2/3 gap-2 mt-4">
					<p className="text-white text-lg">Already have an account?</p>
					<Link to="/login">
						<button className="btn rounded-full btn-primary text-white btn-outline w-full">
							Sign in
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
