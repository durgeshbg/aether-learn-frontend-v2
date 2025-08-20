import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getUserById, upadteUserDetails } from "@/services/user";
import { routes } from "@/static-data/routes";
import { userKeys } from "@/tanstack/keys/userKeys";
import { UserDetailsUpdateSchema, type User } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type z from "zod";

const EditUserDetailsForm = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.getById(userId || ""),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: userId || "" });
    },
    select: (data: { user: User }) => data.user,
  });

  const form = useForm<z.infer<typeof UserDetailsUpdateSchema>>({
    resolver: zodResolver(UserDetailsUpdateSchema),
    defaultValues: {
      ...(user.firstName && { firstName: user.firstName }),
      ...(user.lastName && { lastName: user.lastName }),
      ...(user.email && { email: user.email }),
      // password: '',
    },
  });

  const { mutate } = useMutation({
    mutationKey: userKeys.updateDetails(userId || ""),
    mutationFn: async (data: z.infer<typeof UserDetailsUpdateSchema>) => {
      return upadteUserDetails(
        axiosInstance,
        {
          id: userId || "",
        },
        data,
      );
    },
    meta: {
      notify: true,
      successMessage: "User edited successfully",
      invalidatesQueries: userKeys.getById(userId || ""),
    },
    onSettled: () => {
      form.reset();
      navigate(routes.USER_DETAILS(userId || ""));
    },
  });

  function onSubmit(data: z.infer<typeof UserDetailsUpdateSchema>) {
    mutate(data);
    form.reset();
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Form {...form}>
        <h1 className="text-4xl font-bold mb-6">Update User</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
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

export default EditUserDetailsForm;
