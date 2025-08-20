export type CodeAssessmentFormType = {
  type?: "edit" | "create";
};

export const getCodeAssessmentFormData = (
  type: CodeAssessmentFormType["type"],
) => {
  return {
    title: type === "edit" ? "Edit Code Assessment" : "Create Code Assessment",
    buttonText: type === "edit" ? "Update" : "Create",
  };
};

export type TestCaseFormType = {
  type?: "edit" | "create";
};

export const getTestCaseFormData = (type: TestCaseFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Test Case" : "Create Test Case",
    buttonText: type === "edit" ? "Update" : "Create",
  };
};
