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
import {
  ArrowLeft,
  Shield,
  Crown,
  Save,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
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
        data,
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

  // Enhanced data for display
  const enhancedOrganization = {
    ...organization,
    logo:
      organization.logoUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${organization.name}&backgroundColor=random`,
  };

  const currentAdmin = users.find(
    (user) => user.id === organization.orgAdminId,
  );
  const selectedUser = users.find((user) => user.id === form.watch("userId"));

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--secondary)_0%,_transparent_50%)] opacity-10" />

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
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Update College Administrator
            </h1>
            <p className="text-muted-foreground">
              Assign administrative privileges for {organization.name}
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative p-6 bg-gradient-to-br from-secondary/10 to-primary/10 border-b border-border/20">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <img
                  src={enhancedOrganization.logo}
                  alt={organization.name}
                  className="w-16 h-16 rounded-2xl bg-muted border-3 border-background shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-secondary/30">
                  <Shield className="h-3 w-3 text-secondary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {organization.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {organization.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-700 border border-blue-500/30">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    College
                  </div>
                  {currentAdmin && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30">
                      <Crown className="h-3 w-3 mr-1" />
                      Admin: {currentAdmin.firstName} {currentAdmin.lastName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Current Admin Display */}
                {currentAdmin && (
                  <div className="p-4 rounded-xl bg-muted/10 border border-border/20">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Current Administrator
                    </h3>
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentAdmin.email}`}
                        alt={`${currentAdmin.firstName} ${currentAdmin.lastName}`}
                        className="w-10 h-10 rounded-full bg-muted border-2 border-border/20"
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

                {/* Administrator Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Select New Administrator
                  </h3>

                  <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          College Administrator
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                              <SelectValue placeholder="Select an administrator from college staff" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-md border-border/40">
                            {usersOptions.map((userOption) => {
                              const user = users.find(
                                (u) => u.id === userOption.value,
                              );
                              return (
                                <SelectItem
                                  key={userOption.value}
                                  value={userOption.value}
                                  className="focus:bg-primary/10"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                      alt={userOption.label}
                                      className="w-6 h-6 rounded-full"
                                    />
                                    <div>
                                      <p className="font-medium">
                                        {userOption.label}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {user?.email}
                                      </p>
                                    </div>
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

                  {/* Preview Selected Administrator */}
                  {selectedUser && selectedUser.id !== currentAdmin?.id && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        New Administrator Assignment
                      </h4>
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.email}`}
                          alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                          className="w-10 h-10 rounded-full bg-muted border-2 border-green-500/20"
                        />
                        <div>
                          <p className="font-medium text-green-800">
                            {selectedUser.firstName} {selectedUser.lastName}
                          </p>
                          <p className="text-sm text-green-700">
                            {selectedUser.email}
                          </p>
                          <p className="text-xs text-green-600">
                            Will receive administrative privileges for this
                            college
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-border/20">
                  <Button
                    type="submit"
                    disabled={
                      isPending ||
                      !form.watch("userId") ||
                      form.watch("userId") === currentAdmin?.id
                    }
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Administrator
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isPending}
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
                    disabled={isPending}
                    className="bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20 backdrop-blur-sm disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-secondary/5 to-primary/5 blur-xl" />
        </div>

        {/* Warning Card */}
        <div className="mt-6 rounded-xl bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-amber-500/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-amber-800 mb-1">
                Administrative Access
              </h4>
              <p className="text-sm text-amber-700">
                The selected user will gain administrative privileges for this
                college, including the ability to manage students, courses, and
                college settings. The previous administrator will lose these
                privileges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationEditAdminForm;
