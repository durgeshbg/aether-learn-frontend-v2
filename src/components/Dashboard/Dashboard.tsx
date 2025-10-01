import { useAuth } from "@/hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import OrganizationAdminDashboard from "./OrganizationAdminDashboard";

function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") return <AdminDashboard />;

  if (user?.orgAdminOf)
    return <OrganizationAdminDashboard organizationId={user.orgAdminOf.id} />;

  return <UserDashboard />;
}

export default Dashboard;
