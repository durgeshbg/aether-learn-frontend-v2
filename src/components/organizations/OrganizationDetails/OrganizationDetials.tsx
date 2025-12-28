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
import { ArrowLeft, Edit3, Trash2, Shield } from "lucide-react";
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
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Organization
          </p>
          <h1 className="text-3xl font-semibold text-foreground">
            Organization details
          </h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(routes.ORGANIZATIONS)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to list
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <img
            src={organization.logoUrl}
            alt={organization.name}
            className="h-24 w-24 rounded-2xl border border-border/60"
          />
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">College</p>
              <h2 className="text-2xl font-semibold text-foreground">
                {organization.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {organization.description || "No description available."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Administrator</p>
                <p className="font-medium text-foreground">
                  {organization.orgAdmin
                    ? `${organization.orgAdmin.firstName} ${organization.orgAdmin.lastName}`
                    : "Not assigned"}
                </p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium text-foreground">
                  {organization.address || "Not provided"}
                </p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Website</p>
                <p className="font-medium text-foreground">
                  {organization.websiteUrl || "Not provided"}
                </p>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Contact</p>
                <p className="font-medium text-foreground">
                  {organization.email || "—"} • {organization.phone || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-border/60 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(routes.ORGANIZATION_EDIT(organizationId))}
            className="gap-2"
          >
            <Edit3 className="h-4 w-4" />
            Edit details
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate(routes.ORGANIZATION_EDIT_ADMIN(organizationId))
            }
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Update admin
          </Button>
          {user?.role === "ADMIN" && (
            <Button
              variant="outline"
              className={showDeleteConfirm ? "bg-red-500 text-white" : ""}
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {showDeleteConfirm ? "Confirm delete" : "Delete organization"}
            </Button>
          )}
        </div>

        {showDeleteConfirm && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            Click “Confirm delete” again to permanently remove this
            organization. This action cannot be undone.
          </p>
        )}
      </div>

      {user?.role === "ADMIN" && <OrganizationUsersAndCourses />}
    </div>
  );
};

export default OrganizationDetails;
