import { Button } from "../ui/button";
import { Outlet, useNavigate, useLocation } from "react-router";
import { routes } from "@/static-data/routes";
import { Plus, Users as UsersIcon } from "lucide-react";

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddUser = () => {
    navigate(routes.USER_CREATE);
  };

  const isViewUsersActive = location.pathname === routes.USERS;
  const isAddUserActive = location.pathname === routes.USER_CREATE;

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm">
      {/* Header Section */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/20">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Users
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage and organize your users
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => navigate(routes.USERS)}
              variant={isViewUsersActive ? "default" : "outline"}
              className={`
                relative overflow-hidden backdrop-blur-sm transition-all duration-300
                ${
                  isViewUsersActive
                    ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-card/40 border-border/40 hover:bg-card/60 hover:border-border/60"
                }
              `}
            >
              <UsersIcon className="h-4 w-4 mr-2" />
              View Users
              {isViewUsersActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 animate-pulse" />
              )}
            </Button>

            <Button
              onClick={handleAddUser}
              variant={isAddUserActive ? "default" : "outline"}
              className={`
                relative overflow-hidden backdrop-blur-sm transition-all duration-300
                ${
                  isAddUserActive
                    ? "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-card/40 border-border/40 hover:bg-card/60 hover:border-border/60 hover:shadow-md"
                }
              `}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
              {isAddUserActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 animate-pulse" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 shadow-xl min-h-[600px] relative overflow-hidden">
          {/* Content glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          {/* Content area */}
          <div className="relative z-10 p-6">
            <Outlet />
          </div>

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] [background-size:20px_20px] text-primary pointer-events-none" />
        </div>
      </div>

      {/* Ambient background effects */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-background via-background/98 to-background/95" />
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10" />
    </div>
  );
};

export default Users;
