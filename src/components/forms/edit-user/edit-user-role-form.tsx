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
import { UserRoleUpdateSchema } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type z from "zod";
import { roles } from "../add-user/constants";
import { routes } from "@/static-data/routes";
import {
  ArrowLeft,
  Shield,
  User as UserIcon,
  Crown,
  Save,
  CheckCircle,
  AlertTriangle,
  Users,
} from "lucide-react";

// Role icon mapping for better visualization
const getRoleIcon = (roleValue: string) => {
  switch (roleValue) {
    case "ADMIN":
      return Crown;
    case "ORG_ADMIN":
      return Shield;
    case "USER":
      return UserIcon;
    default:
      return Users;
  }
};

// Role description mapping
const getRoleDescription = (roleValue: string) => {
  switch (roleValue) {
    case "ADMIN":
      return "Full system access with all administrative privileges";
    case "ORG_ADMIN":
      return "Organization-level administration with user management";
    case "USER":
      return "Standard student access with course and assignment features";
    default:
      return "Standard user access";
  }
};

// Role color mapping
const getRoleColor = (roleValue: string) => {
  switch (roleValue) {
    case "ADMIN":
      return "text-red-700 bg-red-500/20 border-red-500/30";
    case "ORG_ADMIN":
      return "text-purple-700 bg-purple-500/20 border-purple-500/30";
    case "USER":
      return "text-blue-700 bg-blue-500/20 border-blue-500/30";
    default:
      return "text-gray-700 bg-gray-500/20 border-gray-500/30";
  }
};

const EditUserRoleForm = () => {
  const navigate = useNavigate();
  const { userId = "" } = useParams<{ userId: string }>();

  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.getById(userId || ""),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: userId });
    },
    select: (data) => data.user,
  });

  const form = useForm<z.infer<typeof UserRoleUpdateSchema>>({
    resolver: zodResolver(UserRoleUpdateSchema),
    defaultValues: {
      role: user.role || "USER",
    },
  });

  const { mutate, isPending } = useMutation({
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

  // Enhanced user data for display
  const enhancedUser = {
    ...user,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
  };

  const currentRole = roles.find((role) => role.value === user.role);
  const selectedRole = roles.find((role) => role.value === form.watch("role"));
  const CurrentRoleIcon = getRoleIcon(user.role);
  const SelectedRoleIcon = selectedRole
    ? getRoleIcon(selectedRole.value)
    : UserIcon;

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--primary)_0%,_transparent_50%)] opacity-10" />

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(routes.USER_DETAILS(userId))}
            className="p-2 hover:bg-card/40 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Update User Role
            </h1>
            <p className="text-muted-foreground">
              Change access permissions for {user.firstName} {user.lastName}
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <img
                  src={enhancedUser.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-16 h-16 rounded-full bg-muted border-3 border-background shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30">
                  <CurrentRoleIcon className="h-3 w-3 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}
                  >
                    <CurrentRoleIcon className="h-3 w-3 mr-1" />
                    {currentRole?.label || user.role}
                  </div>
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
                {/* Current Role Display */}
                <div className="p-4 rounded-xl bg-muted/10 border border-border/20">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Current Role
                  </h3>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${getRoleColor(user.role).replace("text-", "text-").replace("bg-", "bg-").replace("border-", "")}`}
                    >
                      <CurrentRoleIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {currentRole?.label || user.role}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getRoleDescription(user.role)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Select New Role
                  </h3>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          User Role
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                              <SelectValue placeholder="Select a new role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-md border-border/40">
                            {roles.map((role) => {
                              const RoleIcon = getRoleIcon(role.value);
                              return (
                                <SelectItem
                                  key={role.value}
                                  value={role.value}
                                  className="focus:bg-primary/10"
                                >
                                  <div className="flex items-center gap-3">
                                    <RoleIcon className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">
                                        {role.label}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {getRoleDescription(role.value)}
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

                  {/* Preview Selected Role */}
                  {selectedRole && selectedRole.value !== user.role && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                      <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        New Role Assignment
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-green-500/20`}>
                          <SelectedRoleIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">
                            {selectedRole.label}
                          </p>
                          <p className="text-sm text-green-700">
                            {getRoleDescription(selectedRole.value)}
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
                      !form.watch("role") ||
                      form.watch("role") === user.role
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
                        Update Role
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
                    onClick={() => navigate(routes.USER_DETAILS(userId))}
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
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 blur-xl" />
        </div>

        {/* Warning Card */}
        <div className="mt-6 rounded-xl bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-orange-800 mb-1">
                Role Change Impact
              </h4>
              <p className="text-sm text-orange-700">
                Changing user roles will immediately affect their access
                permissions and available features. The user will receive a
                notification about their role change and may need to log in
                again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserRoleForm;
