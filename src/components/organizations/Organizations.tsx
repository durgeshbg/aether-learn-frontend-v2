import { Outlet, useNavigate, useLocation } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { Building2, Plus, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Organizations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleAddOrganization = () => {
    navigate(routes.ORGANIZATION_CREATE);
  };

  const handleViewOrganizations = () => {
    navigate(routes.ORGANIZATIONS);
  };

  const isViewOrganizationsActive = location.pathname === routes.ORGANIZATIONS;
  const isAddOrganizationActive =
    location.pathname === routes.ORGANIZATION_CREATE;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Admin workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Organizations
            </h1>
          </div>
        </div>
        {user?.role === "ADMIN" && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant={isViewOrganizationsActive ? "default" : "outline"}
              onClick={handleViewOrganizations}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              View organizations
            </Button>
            <Button
              variant={isAddOrganizationActive ? "default" : "outline"}
              onClick={handleAddOrganization}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add organization
            </Button>
          </div>
        )}
      </header>

      <section className="rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="min-h-[600px] p-6">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default Organizations;
