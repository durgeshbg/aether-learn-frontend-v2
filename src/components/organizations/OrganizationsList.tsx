import { getOrganizations } from "@/services/organization";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { MapPin, Users, GraduationCap, BookOpen } from "lucide-react";

const OrganizationsList = () => {
  const navigate = useNavigate();
  const { data: organizations } = useSuspenseQuery({
    queryKey: organizationKeys.all(),
    queryFn: async () => {
      return getOrganizations(axiosInstance);
    },
    select: (data) => data.organizations,
  });

  return (
    <div className="space-y-6">
      {/* Colleges Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations?.map((organization) => (
          <div
            key={organization.id}
            className="group relative overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 hover:border-border/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            onClick={() =>
              navigate(routes.ORGANIZATION_DETAILS(organization.id))
            }
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative p-6 space-y-4">
              {/* Header with logo and status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={organization.logoUrl}
                      alt={organization.name}
                      className="w-12 h-12 rounded-full bg-muted border-2 border-border/20"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {organization.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {organization.address}
                    </p>
                  </div>
                </div>
              </div>

              {organization.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {organization.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">
                    {organization.usersCount}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    students
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">
                    {organization.coursesCount}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    programs
                  </span>
                </div>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {(!organizations || organizations.length === 0) && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No colleges found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first college to the network.
          </p>
          <Button onClick={() => navigate(routes.ORGANIZATION_CREATE)}>
            <GraduationCap className="h-4 w-4 mr-2" />
            Add College
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrganizationsList;
