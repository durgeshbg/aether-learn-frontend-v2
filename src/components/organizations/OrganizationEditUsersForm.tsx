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
import { ArrowLeft, Users, UserPlus, UserMinus, Search } from "lucide-react";
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
        { userIds },
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
        { userIds },
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
        u.email?.toLowerCase().includes(q),
    );
  }, [users, query]);

  const loading = adding || removing;

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(routes.ORGANIZATION_DETAILS(organizationId))
            }
            className="p-2 hover:bg-card/40 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 shadow-2xl overflow-hidden">
          {/* Top strip */}
          <div className="relative p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
                {formType === "add" ? (
                  <UserPlus className="h-5 w-5 text-primary" />
                ) : (
                  <UserMinus className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Search */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-9 bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="px-3 py-2 rounded-lg text-sm bg-muted/20 border border-border/20">
                    {filteredUsers?.length || 0} found
                  </div>
                </div>

                {/* Checklist */}
                <FormField
                  control={form.control}
                  name="userIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-3">
                        <FormDescription>
                          Select students to{" "}
                          {formType === "add" ? "add to" : "remove from"} this
                          college.
                        </FormDescription>
                      </div>

                      <div className="rounded-xl border border-border/20 bg-background/40 backdrop-blur-sm">
                        <div className="sticky top-0 z-10 p-3 bg-card/60 backdrop-blur-md border-b border-border/20 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Students</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Check to select
                          </span>
                        </div>

                        <div className="max-h-80 overflow-auto divide-y divide-border/10">
                          {filteredUsers?.map((user) => (
                            <FormField
                              key={user.id}
                              control={form.control}
                              name="userIds"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-3 p-3">
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
                                                (v) => v !== user.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal flex-1 cursor-pointer">
                                    <span className="font-medium text-foreground">
                                      {user.firstName} {user.lastName}
                                    </span>{" "}
                                    <span className="text-muted-foreground">
                                      ({user.email})
                                    </span>
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                          {filteredUsers?.length === 0 && (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                              No students match the search.
                            </div>
                          )}
                        </div>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={loading || form.watch("userIds").length === 0}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : btnText}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={loading}
                    className="bg-card/40 backdrop-blur-sm border-border/40 hover:bg-card/60 disabled:opacity-50"
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
                    className="bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Ambient glow */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 blur-xl" />
        </div>
      </div>
    </div>
  );
};

export default OrganizationEditUsersForm;
