import { getOrganizations } from "@/services/organization";
import { getUserById, updateUserOrganization } from "@/services/user";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { userKeys } from "@/tanstack/keys/userKeys";
import { UserOrganizationUpdateSchema, type User } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type z from "zod";
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
} from "../../ui/select";
import { routes } from "@/static-data/routes";

const EditUserOrganizationForm = () => {
  const { userId = "" } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.getById(userId),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: userId });
    },
    select: (data: { user: User }) => data.user,
  });

  const form = useForm<z.infer<typeof UserOrganizationUpdateSchema>>({
    resolver: zodResolver(UserOrganizationUpdateSchema),
    defaultValues: {
      organizationId: user.organization?.id || "",
    },
  });

  const { mutate } = useMutation({
    mutationKey: userKeys.updateOrganization(userId),
    mutationFn: async (data: z.infer<typeof UserOrganizationUpdateSchema>) => {
      return updateUserOrganization(axiosInstance, { id: userId }, data);
    },
    meta: {
      notify: true,
      successMessage: "Updated user organization successfully",
      invalidatesQueries: userKeys.getById(userId),
    },
    onSettled: () => {
      form.reset();
      navigate(routes.USER_DETAILS(userId));
    },
  });
  const {
    data: { organizations },
  } = useSuspenseQuery({
    queryKey: organizationKeys.all(),
    queryFn: async () => {
      return getOrganizations(axiosInstance);
    },
  });

  function onSubmit(data: z.infer<typeof UserOrganizationUpdateSchema>) {
    mutate(data);
    form.reset();
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Form {...form}>
        <h1 className="text-4xl font-bold mb-6">Update Organization</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md"
        >
          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an Organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations.map((org: { id: string; name: string }) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
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

export default EditUserOrganizationForm;
