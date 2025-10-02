export type QuizFormType = {
  type?: "edit" | "create";
};

export const getQuizFormData = (type: QuizFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Quiz" : "Create Quiz",
    subtitle:
      type === "edit"
        ? "Update quiz information and settings"
        : "Create an engaging quiz to test student knowledge and understanding",
    buttonText: type === "edit" ? "Update" : "Create",
    buttonLoadingText:
      type === "edit" ? "Updating Quiz..." : "Creating Quiz...",
    guidelines: [
      "Create a clear, descriptive title",
      "Explain the quiz format and expectations",
      "Mention the difficulty level",
      "Include estimated completion time",
    ],
  };
};

export type QuestionFormType = {
  type?: "edit" | "create";
};

export const getQuestionFormData = (type: QuestionFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Question" : "Create Question",
    subtitle:
      type === "edit"
        ? "Update quiz question and answer options"
        : "Create an engaging quiz question to test student knowledge",
    buttonText: type === "edit" ? "Update" : "Create",
    buttonLoadingText:
      type === "edit" ? "Updating Question..." : "Creating Question...",
    guidelines: [
      "Ask clear, specific questions",
      "Provide 3-5 answer options",
      "Make incorrect options plausible",
      "Include helpful explanations",
    ],
  };
};

export const MAX_WARNING_COUNT = 3;

export const QuizPreviewData = {
  rules: [
    "You are supposed to complete this quiz in the given time",
    "Quiz will enter fullscreen mode for security",
    "Switching tabs/windows will trigger warnings",
    "3 warnings will auto-submit your quiz",
    "You can review your answers before submitting",
    "Make sure you have a stable internet connection",
    "Refreshing page during test will result in automatic submission",
  ],
};
