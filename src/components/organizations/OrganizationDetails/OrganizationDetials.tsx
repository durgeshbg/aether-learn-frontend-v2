import {
  deleteOrganization,
  getOrganizationById,
} from "@/services/organization";
import { routes } from "@/static-data/routes";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../../ui/button";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Edit3,
  Trash2,
  Shield,
  Mail,
  PhoneCall,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import OrganizationUsersAndCourses from "./OrganizationUsersAndCourses";

const OrganizationDetails = () => {
  const { user } = useAuth();
  const { organizationId = "" } = useParams<{
    organizationId: string;
  }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: organization } = useSuspenseQuery({
    queryKey: organizationKeys.getById(organizationId),
    queryFn: async () => {
      return getOrganizationById(axiosInstance, { id: organizationId || "" });
    },
    select: (data) => data.organization,
  });

  const { mutate: deleteOrganizationMutation, isPending } = useMutation({
    mutationKey: organizationKeys.delete(organizationId),
    mutationFn: async (id: string) => {
      return deleteOrganization(axiosInstance, { id });
    },
    meta: {
      notify: true,
      successMessage: "Organization deleted successfully",
      errorMessage: "Failed to delete organization",
      invalidatesQueries: organizationKeys.all(),
    },
    onSettled: () => {
      navigate(routes.ORGANIZATIONS);
    },
  });

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteOrganizationMutation(organizationId);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(routes.ORGANIZATIONS)}
            className="p-2 hover:bg-card/40 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Organization Details
          </h1>
        </div>

        {/* Organization Profile Card */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative flex flex-col md:flex-row items-start gap-6">
              <img
                src={organization.logoUrl}
                alt={organization.name}
                className="w-24 h-24 rounded-2xl bg-muted border-4 border-background shadow-xl"
              />

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {organization.name}
                </h2>
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {organization.description}
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {`Admin: ${organization.orgAdmin?.firstName} ${organization.orgAdmin?.lastName}`}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {organization.address}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {organization.websiteUrl}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {organization.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneCall className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {organization.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="p-8 border-b border-border/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              Management Actions
            </h3>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-blue-500/10 border-blue-500/20 text-blue-700 hover:bg-blue-500/20"
                onClick={() =>
                  navigate(routes.ORGANIZATION_EDIT(organizationId))
                }
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Organization
              </Button>

              <Button
                variant="outline"
                className="bg-purple-500/10 border-purple-500/20 text-purple-700 hover:bg-purple-500/20"
                onClick={() =>
                  navigate(routes.ORGANIZATION_EDIT_ADMIN(organizationId))
                }
              >
                <Shield className="h-4 w-4 mr-2" />
                Edit Admin
              </Button>

              <Button
                variant="outline"
                className={`transition-all duration-300 ${
                  showDeleteConfirm
                    ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                    : "bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20"
                }`}
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {showDeleteConfirm ? "Confirm Delete" : "Delete Organization"}
              </Button>
            </div>

            {showDeleteConfirm && (
              <p
                className="
                mt-4 text-sm text-red-500 bg-red-100 p-3 rounded-lg
                border border-red-200
              "
              >
                ⚠️ Click "Confirm Delete" again to permanently remove this
                organization. This action cannot be undone.
              </p>
            )}
          </div>
        </div>

        {user?.role === "ADMIN" && <OrganizationUsersAndCourses />}
      </div>
    </div>
  );
};

export default OrganizationDetails;
