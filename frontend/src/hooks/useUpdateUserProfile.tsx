import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IUser } from "../types";

interface IUpdateProfileArgs {
	[key: string]: any; // Use an index signature to handle various types of data
}

const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();

	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
		useMutation<
			IUser, // The type of data returned from the mutation
			Error, // The type of error that may be thrown
			IUpdateProfileArgs // The type of data passed to the mutation function
		>({
			mutationFn: async (formData: IUpdateProfileArgs) => {
				try {
					const res = await fetch(`/api/user/update`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(formData),
					});
					const data = await res.json();
					if (!res.ok) {
						throw new Error(data.error || "Something went wrong");
					}
					return data;
				} catch (error) {
					throw new Error((error as Error).message);
				}
			},
			onSuccess: () => {
				toast.success("Profile updated successfully");
				Promise.all([
					queryClient.invalidateQueries({ queryKey: ["authUser"] }),
					queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
				]);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});

	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
