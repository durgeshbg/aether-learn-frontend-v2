import { getOrganizations } from "@/services/organization";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { routes } from "@/static-data/routes";
import { Users, GraduationCap, BookOpen, Search, Filter } from "lucide-react";

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
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Network overview
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Organizations
            </h2>
            <p className="text-sm text-muted-foreground">
              {organizations?.length || 0} partners across the platform
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1 sm:min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search organizations" className="pl-9" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60">
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 border-b border-border/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Organization</span>
          <span>Members</span>
          <span>Programs</span>
        </div>
        <div className="max-h-[600px] divide-y divide-border/40 overflow-auto">
          {organizations?.map((organization) => (
            <button
              key={organization.id}
              onClick={() =>
                navigate(routes.ORGANIZATION_DETAILS(organization.id))
              }
              className="grid w-full grid-cols-[2fr_1fr_1fr] items-center gap-2 px-4 py-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-center gap-3">
                <img
                  src={organization.logoUrl}
                  alt={organization.name}
                  className="h-10 w-10 rounded-full border border-border/60"
                />
                <span className="font-medium text-foreground">
                  {organization.name}
                </span>
              </div>
              <div className="text-sm font-semibold text-foreground">
                <Users className="mr-2 inline-flex h-4 w-4 text-primary" />
                {organization.usersCount}
              </div>
              <div className="text-sm font-semibold text-foreground">
                <BookOpen className="mr-2 inline-flex h-4 w-4 text-primary" />
                {organization.coursesCount}
              </div>
            </button>
          ))}

          {(!organizations || organizations.length === 0) && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="rounded-full border border-dashed border-muted-foreground/30 p-6">
                <GraduationCap className="h-10 w-10 text-muted-foreground/70" />
              </div>
              <div>
                <p className="text-base font-medium text-foreground">
                  No organizations found
                </p>
                <p className="text-sm text-muted-foreground">
                  Add your first organization to start assigning teams.
                </p>
              </div>
              <Button onClick={() => navigate(routes.ORGANIZATION_CREATE)}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Add organization
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationsList;
