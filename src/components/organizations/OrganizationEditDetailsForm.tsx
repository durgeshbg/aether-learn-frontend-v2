import {
  getOrganizationById,
  updateOrganization,
} from "@/services/organization";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { OrganizationUpdateSchema } from "@/types/Organization";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router";
import { routes } from "@/static-data/routes";
import { ArrowLeft, Save } from "lucide-react";

const OrganizationEditDetailsForm = () => {
  const { organizationId = "" } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();

  const { data: organization } = useSuspenseQuery({
    queryKey: organizationKeys.getById(organizationId),
    queryFn: async () => {
      return getOrganizationById(axiosInstance, { id: organizationId || "" });
    },
    select: (data) => data.organization,
  });

  const form = useForm<z.infer<typeof OrganizationUpdateSchema>>({
    resolver: zodResolver(OrganizationUpdateSchema),
    defaultValues: {
      ...(organization.name && { name: organization.name }),
      ...(organization.description && {
        description: organization.description,
      }),
      ...(organization.address && { address: organization.address }),
      ...(organization.email && { email: organization.email }),
      ...(organization.phone && { phone: organization.phone }),
      ...(organization.websiteUrl && { websiteUrl: organization.websiteUrl }),
      ...(organization.logoUrl && { logoUrl: organization.logoUrl }),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: organizationKeys.create(),
    mutationFn: async (data: z.infer<typeof OrganizationUpdateSchema>) => {
      return updateOrganization(axiosInstance, { id: organizationId }, data);
    },
    meta: {
      notify: true,
      successMessage: "College updated successfully",
      invalidatesQueries: organizationKeys.all(),
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  const onSubmit = (data: z.infer<typeof OrganizationUpdateSchema>) => {
    mutate(data);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Organization
          </p>
          <h1 className="text-3xl font-semibold text-foreground">
            Edit college details
          </h1>
          <p className="text-sm text-muted-foreground">
            Update information for {organization.name}.
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

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MIT College of Engineering"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Briefly describe the campus or focus areas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="info@college.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 College Street, Academic City, State 12345"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.college.edu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.college.edu/logo.png"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate(routes.ORGANIZATION_DETAILS(organizationId))
                  }
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="gap-2">
                  {isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      Updating…
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Update college
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

export default OrganizationEditDetailsForm;
