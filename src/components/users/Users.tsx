import { Outlet, useLocation, useNavigate } from "react-router";
import { Plus, Users as UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from "@/static-data/routes";

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddUser = () => {
    navigate(routes.USER_CREATE);
  };

  const isViewUsersActive = location.pathname === routes.USERS;
  const isAddUserActive = location.pathname === routes.USER_CREATE;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Directory</p>
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-primary/20 bg-primary/10 p-2 text-primary">
              <UsersIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Users
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your roster, invite teammates, and assign roles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={isViewUsersActive ? "default" : "outline"}
            onClick={() => navigate(routes.USERS)}
            className={
              isViewUsersActive ? "bg-primary text-primary-foreground" : ""
            }
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            View users
          </Button>
          <Button
            variant={isAddUserActive ? "default" : "outline"}
            onClick={handleAddUser}
            className={
              isAddUserActive ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add user
          </Button>
        </div>
      </header>

      <Card className="border border-border/60 px-3 py-3">
        <Outlet />
      </Card>
    </div>
  );
};

export default Users;
