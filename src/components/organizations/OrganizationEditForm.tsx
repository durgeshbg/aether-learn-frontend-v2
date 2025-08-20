import OrganizationEditAdminForm from "./OrganizationEditAdminForm";
import OrganizationEditCourseForm from "./OrganizationEditCourseForm";
import OrganizationEditDetailsForm from "./OrganizationEditDetailsForm";
import OrganizationEditUsersForm from "./OrganizationEditUsersForm";

interface OrganizationEditFormProps {
  type?: "details" | "admin" | "users" | "courses";
}

const OrganizationEditForm = ({
  type = "details",
}: OrganizationEditFormProps) => {
  return (
    <div>
      {type === "details" && <OrganizationEditDetailsForm />}
      {type === "admin" && <OrganizationEditAdminForm />}
      {type === "users" && <OrganizationEditUsersForm />}
      {type === "courses" && <OrganizationEditCourseForm />}
    </div>
  );
};

export default OrganizationEditForm;
