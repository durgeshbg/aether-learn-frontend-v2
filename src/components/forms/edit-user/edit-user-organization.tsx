import { useNavigate, useParams } from "react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  Building2,
  CheckCircle,
  MapPin,
  Save,
  School,
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
import { routes } from "@/static-data/routes";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { userKeys } from "@/tanstack/keys/userKeys";
import type { Organization } from "@/types/Organization";
import { UserOrganizationUpdateSchema } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { getOrganizations } from "@/services/organization";
import { getUserById, updateUserOrganization } from "@/services/user";

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
  }

  const currentOrganization = organizations.find(
    (org: Organization) => org.id === user.organization?.id,
  );
  const selectedOrganization = organizations.find(
    (org: Organization) => org.id === form.watch("organizationId"),
  );

  const disableSubmit =
    !form.watch("organizationId") ||
    form.watch("organizationId") === currentOrganization?.id;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {currentOrganization && (
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Current organization
            </p>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold text-foreground">
                {currentOrganization.name}
              </span>
              <span className="text-xs text-muted-foreground">
                ID: {currentOrganization.id}
              </span>
            </div>
          </div>
        )}

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            Assign new organization
          </div>

          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select organization</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations.map((org: { id: string; name: string }) => (
                      <SelectItem key={org.id} value={org.id}>
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          {org.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedOrganization &&
            selectedOrganization.id !== currentOrganization?.id && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="mb-2 flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Selected organization
                </p>
                <p className="font-semibold">{selectedOrganization.name}</p>
                <p className="text-xs text-emerald-800">
                  The learner will be moved to this organization.
                </p>
              </div>
            )}
        </section>

        <div className="flex flex-wrap gap-3 border-t border-border pt-4">
          <Button type="submit" disabled={isPending || disableSubmit}>
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-transparent" />
                Updating
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update organization
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

export default EditUserOrganizationForm;
