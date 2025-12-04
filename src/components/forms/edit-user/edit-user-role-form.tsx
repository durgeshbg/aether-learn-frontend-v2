import { useNavigate, useParams } from "react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  AlertTriangle,
  Crown,
  Save,
  Shield,
  User as UserIcon,
  Users,
} from "lucide-react";

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
import { roles } from "../add-user/constants";
import { routes } from "@/static-data/routes";
import { userKeys } from "@/tanstack/keys/userKeys";
import { UserRoleUpdateSchema } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { getUserById, updateUserRole } from "@/services/user";

const roleIconMap = {
  ADMIN: Crown,
  ORG_ADMIN: Shield,
  USER: UserIcon,
} as const;

const roleBadgeClasses = {
  ADMIN: "text-red-700 bg-red-500/15 border-red-500/20",
  ORG_ADMIN: "text-purple-700 bg-purple-500/15 border-purple-500/20",
  USER: "text-blue-700 bg-blue-500/15 border-blue-500/20",
};

const EditUserRoleForm = () => {
  const navigate = useNavigate();
  const { userId = "" } = useParams<{ userId: string }>();

  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.getById(userId),
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

  const selectedRole = form.watch("role");
  const RoleBadgeIcon =
    roleIconMap[selectedRole as keyof typeof roleIconMap] ?? Users;
  const badgeClass =
    roleBadgeClasses[selectedRole as keyof typeof roleBadgeClasses] ??
    "text-muted-foreground bg-muted border-border";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground">
            Current role:{" "}
            <span className="font-semibold text-foreground">{user.role}</span>
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            Select a new role
          </div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a new role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => {
                      const RoleIcon =
                        roleIconMap[role.value as keyof typeof roleIconMap] ??
                        Users;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <RoleIcon className="h-4 w-4 text-muted-foreground" />
                            {role.label}
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

          <div className="rounded-xl border border-border/60 bg-card/60 p-4">
            <p className="text-xs uppercase text-muted-foreground">Preview</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize">
              <RoleBadgeIcon className={`h-3 w-3 ${badgeClass}`} />
              <span className={badgeClass}>{selectedRole}</span>
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <div>
              <p className="font-medium">Role change impact</p>
              <p className="text-orange-800">
                Ask the learner to log out and back in to refresh permissions
                after saving.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-border pt-4">
          <Button
            type="submit"
            disabled={
              isPending || !selectedRole || selectedRole === user.role
            }
          >
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-transparent" />
                Updating
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update role
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(routes.USER_DETAILS(userId))}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUserRoleForm;
