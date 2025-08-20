import { deleteUser, getUserById } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const {
    data: { user },
  } = useSuspenseQuery({
    queryKey: userKeys.getById(userId || ""),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: userId || "" });
    },
  });

  const { mutate } = useMutation({
    mutationKey: userKeys.delete(userId || ""),
    mutationFn: async (id: string) => {
      return deleteUser(axiosInstance, { id });
    },
    meta: {
      notify: true,
      successMessage: "User deleted successfully",
      errorMessage: "Failed to delete user",
      invalidatesQueries: userKeys.all(),
    },
    onSettled: () => {
      navigate(routes.USERS);
    },
  });

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        <div className="mb-2">
          <strong>ID:</strong> {user.id}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="mb-2">
          <strong>Role:</strong> {user.role}
        </div>
        <div className="mb-2">
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </div>
        <div className="mb-2">
          <strong>Organization:</strong>{" "}
          {(user.organization && JSON.stringify(user.organization)) || "None"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">Actions</h3>
        <Button
          variant="outline"
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            navigate(routes.USER_EDIT(userId || ""));
          }}
        >
          Edit User Details
        </Button>
        <Button
          variant="outline"
          className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            navigate(routes.USER_EDIT_ROLE(userId || ""));
          }}
        >
          Edit User Role
        </Button>
        <Button
          variant="outline"
          className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => {
            navigate(routes.USER_EDIT_ORGANIZATION(userId || ""));
          }}
        >
          Edit User Organization
        </Button>
        <Button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            mutate(userId || "");
          }}
        >
          Delete User
        </Button>
      </div>
    </div>
  );
};

export default UserDetails;
