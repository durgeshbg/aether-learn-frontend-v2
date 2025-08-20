import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserById, updateUserRole } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { UserRoleUpdateSchema, type User } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type z from "zod";
import { roles } from "../add-user/constants";
import { routes } from "@/static-data/routes";

const EditUserRoleForm = () => {
  const navigate = useNavigate();
  const { userId = "" } = useParams<{ userId: string }>();

  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.getById(userId || ""),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: userId });
    },
    select: (data: { user: User }) => data.user,
  });

  const form = useForm<z.infer<typeof UserRoleUpdateSchema>>({
    resolver: zodResolver(UserRoleUpdateSchema),
    defaultValues: {
      role: user.role || "USER",
    },
  });

  const { mutate } = useMutation({
    mutationKey: userKeys.create(),
    mutationFn: async (data: z.infer<typeof UserRoleUpdateSchema>) => {
      return updateUserRole(axiosInstance, { id: userId }, data);
    },
    meta: {
      notify: true,
      successMessage: "User role updated successfully",
      invalidatesQueries: userKeys.getById(userId),
    },
    onSettled: () => {
      form.reset();
      navigate(routes.USER_DETAILS(userId));
    },
  });

  function onSubmit(data: z.infer<typeof UserRoleUpdateSchema>) {
    mutate(data);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Form {...form}>
        <h1 className="text-4xl font-bold mb-6">Update user role</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
};

export default EditUserRoleForm;
