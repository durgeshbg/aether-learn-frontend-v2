import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/static-data/routes";
import { userKeys } from "@/tanstack/keys/userKeys";
import { getUsers } from "@/services/user";
import { axiosInstance } from "@/utils/axiosInstance";

const UsersList = () => {
  const navigate = useNavigate();
  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.all(),
    queryFn: async () => getUsers(axiosInstance),
    select: (data) => data.users,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Team directory
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Students
            </h2>
            <p className="text-sm text-muted-foreground">
              {users?.length || 0} records across organizations
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1 sm:min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users"
                className="pl-9"
                aria-label="Search users"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/60">
        <div className="grid grid-cols-[1.2fr_1.6fr_1fr_110px] gap-2 border-b border-border/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <span>Name</span>
          <span>Email</span>
          <span>Organization</span>
          <span className="text-right">Role</span>
        </div>

        <div className="max-h-[600px] divide-y divide-border/40 overflow-auto">
          {users?.map((user) => (
            <button
              key={user.id}
              onClick={() => navigate(routes.USER_DETAILS(user.id))}
              className="grid w-full grid-cols-[1.2fr_1.6fr_1fr_110px] items-center gap-2 px-4 py-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </span>
                {user.uniqueId && (
                  <span className="text-xs text-muted-foreground">
                    ID #{user.uniqueId}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                {user.organization?.name ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">
                      {user.organization.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground/70">Unassigned</span>
                )}
                {user.branch && (
                  <div className="flex items-center gap-2 text-xs">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {user.branch}
                      {user.year ? ` • ${user.year}` : ""}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  {user.role || "Student"}
                </span>
              </div>
            </button>
          ))}

          {(!users || users.length === 0) && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="rounded-full border border-dashed border-muted-foreground/30 p-6">
                <Users className="h-10 w-10 text-muted-foreground/70" />
              </div>
              <div>
                <p className="text-base font-medium text-foreground">
                  No users found
                </p>
                <p className="text-sm text-muted-foreground">
                  Use the “Add user” action to invite your first teammate.
                </p>
              </div>
              <Button onClick={() => navigate(routes.USER_CREATE)}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Add user
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
