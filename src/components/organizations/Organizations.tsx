import { Outlet, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";

const Organizations = () => {
  const navigate = useNavigate();

  const handleAddOrganization = () => {
    navigate(routes.ORGANIZATION_CREATE);
  };

  const handleViewOrganizations = () => {
    navigate(routes.ORGANIZATIONS);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="flex mb-4">
        <Button
          onClick={handleViewOrganizations}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
        >
          View Organizations
        </Button>
        <Button
          onClick={handleAddOrganization}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Organization
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default Organizations;
