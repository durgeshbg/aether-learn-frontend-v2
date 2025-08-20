import { OrganizationUserUpdateSchema } from "@/types/Organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import {
  addOrganizationUsers,
  removeOrganizationUsers,
} from "@/services/organization";
import { axiosInstance } from "@/utils/axiosInstance";
import { userKeys } from "@/tanstack/keys/userKeys";
import { getNonOrganizationUsers, getUsers } from "@/services/user";
import type { User } from "@/types/User";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { routes } from "@/static-data/routes";
import { getOrganizationUsersEditFormData, type IformType } from "./constants";

const OrganizationEditUsersForm = () => {
  const { organizationId = "" } = useParams<{
    organizationId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formType: IformType =
    searchParams.get("type") === "remove" ? "remove" : "add";

  const { title, btnText, description } =
    getOrganizationUsersEditFormData(formType);

  const form = useForm<z.infer<typeof OrganizationUserUpdateSchema>>({
    resolver: zodResolver(OrganizationUserUpdateSchema),
    defaultValues: {
      userIds: [],
    },
  });

  const { data: users } = useSuspenseQuery({
    queryKey:
      formType === "remove"
        ? userKeys.getByOrganization(organizationId)
        : userKeys.allNonOrganization(),
    queryFn: async () => {
      return formType === "remove"
        ? getUsers(axiosInstance, { organizationId })
        : getNonOrganizationUsers(axiosInstance);
    },
    select: (data: { users: User[] }) => data.users,
  });

  const { mutate: addUsers } = useMutation({
    mutationKey: organizationKeys.addUsers(organizationId),
    mutationFn: async (userIds: string[]) => {
      return addOrganizationUsers(
        axiosInstance,
        { id: organizationId },
        {
          userIds,
        },
      );
    },
    meta: {
      notify: true,
      successMessage: "Users added successfully",
      invalidatesQueries: userKeys.all(),
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  const { mutate: removeUsers } = useMutation({
    mutationKey: organizationKeys.removeUsers(organizationId),
    mutationFn: async (userIds: string[]) => {
      return removeOrganizationUsers(
        axiosInstance,
        { id: organizationId },
        {
          userIds,
        },
      );
    },
    meta: {
      notify: true,
      successMessage: "Users removed successfully",
      invalidatesQueries: userKeys.all(),
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  const onSubmit = (data: z.infer<typeof OrganizationUserUpdateSchema>) => {
    if (formType === "add") {
      addUsers(data.userIds);
    } else {
      removeUsers(data.userIds);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Form {...form}>
        <h1 className="text-4xl font-bold mb-6">{title}</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md"
        >
          <FormField
            control={form.control}
            name="userIds"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormDescription>{description}</FormDescription>
                </div>
                {users.map((user) => (
                  <FormField
                    key={user.id}
                    control={form.control}
                    name="userIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={user.id}
                          className="flex flex-row items-center gap-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(user.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, user.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== user.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {user.firstName} {user.lastName} ({user.email})
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{btnText}</Button>
        </form>
      </Form>
    </div>
  );
};

export default OrganizationEditUsersForm;
