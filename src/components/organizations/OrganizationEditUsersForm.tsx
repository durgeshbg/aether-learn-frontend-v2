import { OrganizationUserUpdateSchema } from "@/types/Organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
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
import { Users, UserPlus, UserMinus, Search, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";

const OrganizationEditUsersForm = () => {
  const { organizationId = "" } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formType: IformType =
    searchParams.get("type") === "remove" ? "remove" : "add";

  const { title, btnText, description } =
    getOrganizationUsersEditFormData(formType);

  const form = useForm<z.infer<typeof OrganizationUserUpdateSchema>>({
    resolver: zodResolver(OrganizationUserUpdateSchema),
    defaultValues: { userIds: [] },
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

  const { mutate: addUsers, isPending: adding } = useMutation({
    mutationKey: organizationKeys.addUsers(organizationId),
    mutationFn: async (userIds: string[]) => {
      return addOrganizationUsers(
        axiosInstance,
        { id: organizationId },
        { userIds }
      );
    },
    meta: {
      notify: true,
      successMessage: "Users added successfully",
      invalidatesQueries: [
        userKeys.all(),
        organizationKeys.getById(organizationId),
      ],
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  const { mutate: removeUsers, isPending: removing } = useMutation({
    mutationKey: organizationKeys.removeUsers(organizationId),
    mutationFn: async (userIds: string[]) => {
      return removeOrganizationUsers(
        axiosInstance,
        { id: organizationId },
        { userIds }
      );
    },
    meta: {
      notify: true,
      successMessage: "Users removed successfully",
      invalidatesQueries: [
        userKeys.all(),
        organizationKeys.getById(organizationId),
      ],
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  const onSubmit = (data: z.infer<typeof OrganizationUserUpdateSchema>) => {
    if (formType === "add") addUsers(data.userIds);
    else removeUsers(data.userIds);
  };

  // Local search for convenience (does not change your server logic)
  const [query, setQuery] = useState("");
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, query]);

  const loading = adding || removing;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Organization users
          </p>
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(routes.ORGANIZATION_DETAILS(organizationId))}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to details
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {formType === "add" ? (
              <UserPlus className="h-4 w-4 text-primary" />
            ) : (
              <UserMinus className="h-4 w-4 text-primary" />
            )}
            {formType === "add"
              ? "Select students to add to this organization."
              : "Select students to remove from this organization."}
          </div>
        </div>

        <div className="space-y-6 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <span className="rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground">
                  {filteredUsers?.length || 0} found
                </span>
              </div>

              <FormField
                control={form.control}
                name="userIds"
                render={() => (
                  <FormItem>
                    <div className="rounded-xl border border-border/60">
                      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Students
                      </div>
                      <div className="max-h-80 divide-y divide-border/60 overflow-auto">
                        {filteredUsers?.map((user) => (
                          <FormField
                            key={user.id}
                            control={form.control}
                            name="userIds"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-3 px-4 py-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(user.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            user.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (v) => v !== user.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="flex-1 cursor-pointer text-sm font-medium text-foreground">
                                  {user.firstName} {user.lastName}
                                  <span className="block text-xs text-muted-foreground">
                                    {user.email}
                                  </span>
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                        {filteredUsers?.length === 0 && (
                          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                            No students match the search.
                          </div>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate(routes.ORGANIZATION_DETAILS(organizationId))
                  }
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || form.watch("userIds").length === 0}
                >
                  {loading ? "Processing…" : btnText}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationEditUsersForm;
