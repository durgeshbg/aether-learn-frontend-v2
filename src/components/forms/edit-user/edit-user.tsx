import { Link, useNavigate, useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditUserDetailsForm from "./edit-user-details-form";
import EditUserOrganizationForm from "./edit-user-organization";
import EditUserRoleForm from "./edit-user-role-form";
import { routes } from "@/static-data/routes";
import { userKeys } from "@/tanstack/keys/userKeys";
import { getUserById } from "@/services/user";
import { axiosInstance } from "@/utils/axiosInstance";

type EditUserFormProps = {
  type?: "details" | "organization" | "role";
};

const sectionIcons = {
  details: User,
  organization: Building2,
  role: Shield,
} satisfies Record<NonNullable<EditUserFormProps["type"]>, typeof User>;

const EditUserForm = ({ type = "details" }: EditUserFormProps) => {
  const navigate = useNavigate();
  const { userId = "" } = useParams<{ userId: string }>();

  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.getById(userId),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: userId });
    },
    select: (data) => data.user,
  });

  const sections = {
    details: {
      label: "Profile",
      title: "Edit personal details",
      description: "Update the learner’s name, contact info, and identifiers.",
      path: routes.USER_EDIT(userId),
      icon: sectionIcons.details,
    },
    organization: {
      label: "Organization",
      title: "Manage organization access",
      description:
        "Reassign the learner to a different organization or workspace.",
      path: routes.USER_EDIT_ORGANIZATION(userId),
      icon: sectionIcons.organization,
    },
    role: {
      label: "Role",
      title: "Adjust permissions",
      description: "Promote or demote the learner across platform roles.",
      path: routes.USER_EDIT_ROLE(userId),
      icon: sectionIcons.role,
    },
  } as const;

  const activeSection = sections[type] ?? sections.details;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <Button
        variant="ghost"
        className="w-fit gap-2 px-0 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(routes.USER_DETAILS(userId))}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to user profile
      </Button>

      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Manage {user.firstName} {user.lastName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {user.email} • {user.role}
        </p>
      </header>

      {user.role === "ADMIN" && (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(sections) as Array<keyof typeof sections>).map(
            (sectionKey) => {
              const section = sections[sectionKey];
              const Icon = section.icon;

              return (
                <Button
                  key={sectionKey}
                  variant={sectionKey === type ? "default" : "outline"}
                  className="gap-2"
                  asChild
                >
                  <Link to={section.path}>
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </Link>
                </Button>
              );
            }
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{activeSection.title}</CardTitle>
          <CardDescription>{activeSection.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {type === "details" && <EditUserDetailsForm />}
          {type === "organization" && <EditUserOrganizationForm />}
          {type === "role" && <EditUserRoleForm />}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserForm;
