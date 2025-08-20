import { Button } from "@/components/ui/button";

const TestData = ({ form }) => {
  {
    /* FIXME: For testing purposes, use */
  }
  return (
    <div className="flex gap-3">
      <Button
        variant="secondary"
        type="button"
        onClick={() => {
          form.setValue("email", "admin@dummmy.com");
          form.setValue("password", "password");
          form.setValue("firstName", "Admin");
          form.setValue("lastName", "User");
          form.setValue("orgAdmin", false);
          form.setValue("role", "ADMIN");
        }}
      >
        Admin Data
      </Button>
      <Button
        variant="secondary"
        type="button"
        onClick={() => {
          form.setValue("email", "admin2@dummmy.com");
          form.setValue("password", "password");
          form.setValue("firstName", "Org");
          form.setValue("lastName", "Admin");
          form.setValue("orgAdmin", true);
          form.setValue("role", "ADMIN");
        }}
      >
        Org Admin Data
      </Button>
      <Button
        variant="secondary"
        type="button"
        onClick={() => {
          form.setValue("email", "user10@dummmy.com");
          form.setValue("password", "password");
          form.setValue("firstName", "User");
          form.setValue("lastName", "Ten");
          form.setValue("orgAdmin", false);
          form.setValue("role", "USER");
        }}
      >
        User Data
      </Button>
    </div>
  );
};

export default TestData;
