import { Button } from "@/components/ui/button";
import type { UseFormReturn } from "react-hook-form";

const TestData = ({
  form,
}: {
  form: UseFormReturn<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    orgAdmin?: boolean;
    role?: "ADMIN" | "USER";
    branch?: string;
    year?: number;
    uniqueId?: string;
  }>;
}) => {
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
          form.setValue("email", "org@dummmy.com");
          form.setValue("password", "password");
          form.setValue("firstName", "Org");
          form.setValue("lastName", "Admin");
          form.setValue("orgAdmin", true);
          form.setValue("role", "USER");
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
          form.setValue("branch", "Computer Science");
          form.setValue("year", 2026);
          form.setValue("uniqueId", "U20261001");
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
