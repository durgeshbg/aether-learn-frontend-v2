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
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image,
  Save,
  Sparkles,
} from "lucide-react";

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
    <div className="min-h-screen bg-background/50 backdrop-blur-sm p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--primary)_0%,_transparent_50%)] opacity-10" />

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
              Edit College Details
            </h1>
            <p className="text-muted-foreground">
              Update information for {organization.name}
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative flex items-center gap-4">
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="w-16 h-16 rounded-2xl bg-muted border-3 border-background shadow-lg"
              />
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {organization.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {organization.description}
                </p>
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
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            College Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MIT College of Engineering"
                              className="bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
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
                          <FormLabel className="text-foreground font-medium">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="A premier educational institution committed to academic excellence and innovation"
                              className="bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Contact Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="info@college.edu"
                                className="pl-10 bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                {...field}
                              />
                            </div>
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
                          <FormLabel className="text-foreground font-medium">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="+1 (555) 123-4567"
                                className="pl-10 bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                {...field}
                              />
                            </div>
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
                        <FormLabel className="text-foreground font-medium">
                          Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="123 College Street, Academic City, State 12345"
                              className="pl-10 bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Online Presence Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Online Presence
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">
                            Website URL
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="https://www.college.edu"
                                className="pl-10 bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                {...field}
                              />
                            </div>
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
                          <FormLabel className="text-foreground font-medium">
                            Logo URL
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="https://www.college.edu/logo.png"
                                className="pl-10 bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-border/20">
                  <Button
                    type="submit"
                    disabled={isPending}
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
                        Update College
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
                    Reset Changes
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
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 blur-xl" />
        </div>

        {/* Info Card */}
        <div className="mt-6 rounded-xl bg-orange-500/10 backdrop-blur-sm border border-orange-500/20 p-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-orange-500/20 rounded-lg">
              <Sparkles className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-orange-800 mb-1">
                Update Information
              </h4>
              <p className="text-sm text-orange-700">
                Changes will be saved immediately and reflected across the
                system. Students and staff will be notified of significant
                changes like contact information updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationEditDetailsForm;
