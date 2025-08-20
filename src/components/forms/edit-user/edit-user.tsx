import EditUserDetailsForm from "./edit-user-details-form";
import EditUserOrganizationForm from "./edit-user-organization";
import EditUserRoleForm from "./edit-user-role-form";

type EditUserFormProps = {
  type?: "details" | "organization" | "role";
};

const EditUserForm = ({ type = "details" }: EditUserFormProps) => {
  return (
    <div>
      {type === "details" && <EditUserDetailsForm />}
      {type === "organization" && <EditUserOrganizationForm />}
      {type === "role" && <EditUserRoleForm />}
    </div>
  );
};

export default EditUserForm;
