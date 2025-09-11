import { getOrganizations } from "@/services/organization";
import { getUserById, updateUserOrganization } from "@/services/user";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { userKeys } from "@/tanstack/keys/userKeys";
import { UserOrganizationUpdateSchema } from "@/types/User";
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
import {
  ArrowLeft,
  Building2,
  School,
  Save,
  Sparkles,
  CheckCircle,
  MapPin,
} from "lucide-react";
import type { Organization } from "@/types/Organization";

const EditUserOrganizationForm = () => {
  const { userId = "" } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.getById(userId),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: userId });
    },
    select: (data) => data.user,
  });

  const form = useForm<z.infer<typeof UserOrganizationUpdateSchema>>({
    resolver: zodResolver(UserOrganizationUpdateSchema),
    defaultValues: {
      organizationId: user.organization?.id || "",
    },
  });

  const { mutate, isPending } = useMutation({
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

  // Enhanced user data for display
  const enhancedUser = {
    ...user,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
  };

  const currentOrganization = organizations.find(
    (org: Organization) => org.id === user.organization?.id,
  );
  const selectedOrganization = organizations.find(
    (org: Organization) => org.id === form.watch("organizationId"),
  );

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
            onClick={() => navigate(routes.USER_DETAILS(userId))}
            className="p-2 hover:bg-card/40 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Change Organization
            </h1>
            <p className="text-muted-foreground">
              Update institutional affiliation for {user.firstName}{" "}
              {user.lastName}
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
                  src={enhancedUser.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-16 h-16 rounded-full bg-muted border-3 border-background shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-secondary/30">
                  <Building2 className="h-3 w-3 text-secondary" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                    {user.role}
                  </div>
                  {currentOrganization && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30">
                      <Building2 className="h-3 w-3 mr-1" />
                      {currentOrganization.name}
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
                {/* Current Organization Display */}
                {currentOrganization && (
                  <div className="p-4 rounded-xl bg-muted/10 border border-border/20">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Current Organization
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/20 rounded-lg">
                        <School className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {currentOrganization.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ID: {currentOrganization.id}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Organization Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    New Organization
                  </h3>

                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Select Organization
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                              <SelectValue placeholder="Choose a new organization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card/95 backdrop-blur-md border-border/40">
                            {organizations.map(
                              (org: { id: string; name: string }) => (
                                <SelectItem
                                  key={org.id}
                                  value={org.id}
                                  className="focus:bg-primary/10"
                                >
                                  <div className="flex items-center gap-2">
                                    <School className="h-4 w-4 text-muted-foreground" />
                                    {org.name}
                                  </div>
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Preview Selected Organization */}
                  {selectedOrganization &&
                    selectedOrganization.id !== currentOrganization?.id && (
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Selected Organization
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <School className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-green-800">
                              {selectedOrganization.name}
                            </p>
                            <p className="text-sm text-green-700">
                              Student will be transferred to this organization
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
                      !form.watch("organizationId") ||
                      form.watch("organizationId") === currentOrganization?.id
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
                        Update Organization
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
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-secondary/5 to-primary/5 blur-xl" />
        </div>

        {/* Warning Card */}
        <div className="mt-6 rounded-xl bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-yellow-500/20 rounded-lg">
              <Sparkles className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800 mb-1">
                Organization Transfer
              </h4>
              <p className="text-sm text-yellow-700">
                Changing the organization will transfer the student's access and
                permissions to the new institution. This action will notify both
                the student and the organization administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserOrganizationForm;
