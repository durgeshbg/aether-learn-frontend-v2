import { getOrganizations } from "@/services/organization";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import type { Organization } from "@/types/Organization";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";

const OrganizationsList = () => {
  const navigate = useNavigate();
  const { data: organizations } = useSuspenseQuery({
    queryKey: organizationKeys.all(),
    queryFn: async () => {
      return getOrganizations(axiosInstance);
    },
    select: (data: { organizations: Organization[] }) => data.organizations,
  });

  return (
    <ul className="list-disc pl-5">
      {organizations?.map((organization) => (
        <li key={organization.id} className="mb-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              navigate(routes.ORGANIZATION_DETAILS(organization.id));
            }}
          >
            <div>{organization.name}</div>
            <div>{organization.description}</div>
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationsList;
