export type QuizFormType = {
  type?: "edit" | "create";
};

export const getQuizFormData = (type: QuizFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Quiz" : "Create Quiz",
    buttonText: type === "edit" ? "Update" : "Create",
  };
};

export type QuestionFormType = {
  type?: "edit" | "create";
};

export const getQuestionFormData = (type: QuestionFormType["type"]) => {
  return {
    title: type === "edit" ? "Edit Question" : "Create Question",
    buttonText: type === "edit" ? "Update" : "Create",
  };
};
