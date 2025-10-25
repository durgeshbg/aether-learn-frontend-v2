import { Edit3, Plus } from "lucide-react";

export type CodeAssessmentFormType = {
  type?: "edit" | "create";
};

export const getCodeAssessmentFormData = (
  type: CodeAssessmentFormType["type"],
) => {
  return {
    title: type === "edit" ? "Edit Code Assessment" : "Create Code Assessment",
    buttonText: type === "edit" ? "Update" : "Create",
    buttonLoadingText:
      type === "edit" ? "Updating Assessment..." : "Creating Assessment...",
    backButtonText: type === "edit" ? "Back to Assessment" : "Back to Course",
    icon:
      type === "edit" ? (
        <Edit3 className="h-8 w-8 text-white/80" />
      ) : (
        <Plus className="h-8 w-8 text-white/80" />
      ),
    description:
      type === "edit"
        ? "Update coding assessment details and requirements"
        : "Create a comprehensive coding challenge for students to solve",
    guidelines: [
      "Define clear problem statements",
      "Provide comprehensive examples",
      "Include starter code and comments",
      "Specify constraints and edge cases",
    ],
    estimatedTime: [
      { level: "Easy Problems", time: "15-30 min" },
      { level: "Medium Problems", time: "30-60 min" },
      { level: "Hard Problems", time: "60+ min" },
    ],
  };
};

export type TestCaseFormType = {
  type?: "edit" | "create";
};

export const getTestCaseFormData = (type: TestCaseFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Test Case" : "Create Test Case",
    buttonText: type === "edit" ? "Update" : "Create",
    description:
      type === "edit"
        ? "Update test case input and expected output validation"
        : "Create a test case to validate student code solutions automatically",
    icon:
      type === "edit" ? (
        <Edit3 className="h-8 w-8 text-white/80" />
      ) : (
        <Plus className="h-8 w-8 text-white/80" />
      ),
    formatExamples: [
      {
        label: "Arrays",
        example: "[1, 2, 3, 4, 5]",
        color: "text-emerald-400",
      },
      {
        label: "Strings",
        example: '"hello world"',
        color: "text-blue-400",
      },
      {
        label: "Numbers",
        example: "42",
        color: "text-yellow-400",
      },
      {
        label: "Booleans",
        example: "true",
        color: "text-purple-400",
      },
      {
        label: "Multiple params",
        example: "One per line",
        color: "text-white/70",
      },
    ],
  };
};

export const adminCodeAssessmentData = {
  backButtonText: "Back to Course",
  editButtonText: "Edit Assessment",
  deleteButtonText: "Delete Assessment",
  deleteLoadingText: "Deleting...",
  addTestCaseButtonText: "Add",
  emptyTestCasesText: "No test cases added yet.",
  testCaseAddTip: "Add test cases to validate student solutions",
  createFirstTestCaseText: "Create First Test Case",
};

export const MONACO_THEMES = [
  { value: "vs", label: "Light" },
  { value: "vs-dark", label: "Dark" },
  { value: "hc-black", label: "High Contrast Dark" },
  { value: "hc-light", label: "High Contrast Light" },
] as const;
