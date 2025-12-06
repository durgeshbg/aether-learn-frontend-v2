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
import { OrgAdminUpdateScehma } from "@/types/Organization";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import z from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { routes } from "@/static-data/routes";

const OrganizationEditAdminForm = () => {
  const { organizationId = "" } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();

  const { data: organization } = useSuspenseQuery({
    queryKey: organizationKeys.getById(organizationId),
    queryFn: async () => {
      return getOrganizationById(axiosInstance, { id: organizationId || "" });
    },
    select: (data) => data.organization,
  });

  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return getUsers(axiosInstance, { organizationId });
    },
    select: (data) => data.users,
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

  const { mutate, isPending } = useMutation({
    mutationKey: organizationKeys.updateAdmin(organizationId),
    mutationFn: async (data: z.infer<typeof OrgAdminUpdateScehma>) => {
      return updateOrganizationAdmin(
        axiosInstance,
        { id: organizationId },
        data
      );
    },
    meta: {
      notify: true,
      successMessage: "College administrator updated successfully",
      invalidatesQueries: organizationKeys.getById(organizationId),
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  function onSubmit(data: z.infer<typeof OrgAdminUpdateScehma>) {
    mutate(data);
  }

  const currentAdmin = users.find(
    (user) => user.id === organization.orgAdminId
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Organization
          </p>
          <h1 className="text-3xl font-semibold text-foreground">
            Update administrator
          </h1>
          <p className="text-sm text-muted-foreground">
            Reassign the primary point of contact for {organization.name}.
          </p>
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
          <div className="flex items-center gap-3">
            <img
              src={organization.logoUrl}
              alt={organization.name}
              className="h-12 w-12 rounded-full border border-border/60"
            />
            <div>
              <p className="text-base font-semibold text-foreground">
                {organization.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {organization.description || "No description available."}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {currentAdmin && (
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Current administrator
              </p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentAdmin.email}`}
                  alt={`${currentAdmin.firstName} ${currentAdmin.lastName}`}
                  className="h-10 w-10 rounded-full border border-border/60"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {currentAdmin.firstName} {currentAdmin.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentAdmin.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New administrator</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an administrator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {usersOptions.map((userOption) => {
                          const user = users.find(
                            (u) => u.id === userOption.value
                          );
                          return (
                            <SelectItem
                              key={userOption.value}
                              value={userOption.value}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                  alt={userOption.label}
                                  className="h-6 w-6 rounded-full"
                                />
                                <span>{userOption.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isPending}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    !form.watch("userId") ||
                    form.watch("userId") === currentAdmin?.id
                  }
                  className="gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      Updating…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update administrator
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationEditAdminForm;
