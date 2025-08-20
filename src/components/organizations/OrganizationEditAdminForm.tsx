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
import {
  getOrganizationById,
  updateOrganizationAdmin,
} from "@/services/organization";
import { getUsers } from "@/services/user";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { userKeys } from "@/tanstack/keys/userKeys";
import { OrgAdminUpdateScehma, type Organization } from "@/types/Organization";
import type { User } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import z from "zod";

const OrganizationEditAdminForm = () => {
  const { organizationId = "" } = useParams<{ organizationId: string }>();

  const { data: organization } = useSuspenseQuery({
    queryKey: organizationKeys.getById(organizationId),
    queryFn: async () => {
      return getOrganizationById(axiosInstance, { id: organizationId || "" });
    },
    select: (data: { organization: Organization }) => data.organization,
  });

  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return getUsers(axiosInstance, { organizationId });
    },
    select: (data: { users: User[] }) => data.users,
  });

  const form = useForm<z.infer<typeof OrgAdminUpdateScehma>>({
    resolver: zodResolver(OrgAdminUpdateScehma),
    defaultValues: {
      ...(organization.orgAdminId && { userId: organization.orgAdminId }),
    },
  });

  const usersOptions = users.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const { mutate } = useMutation({
    mutationKey: organizationKeys.updateAdmin(organizationId),
    mutationFn: async (data: z.infer<typeof OrgAdminUpdateScehma>) => {
      return updateOrganizationAdmin(
        axiosInstance,
        { id: organizationId },
        data,
      );
    },
    meta: {
      notify: true,
      successMessage: "Organization admin updated successfully",
      invalidatesQueries: organizationKeys.getById(organizationId),
    },
    onSettled: () => {
      form.reset();
    },
  });

  function onSubmit(data: z.infer<typeof OrgAdminUpdateScehma>) {
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
            name="userId"
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
                    {usersOptions.map((role) => (
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

export default OrganizationEditAdminForm;
