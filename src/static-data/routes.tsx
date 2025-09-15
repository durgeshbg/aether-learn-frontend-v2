export const routes = {
  HOME: "/",
  LOGIN: "/login",
  USERS: "/users",
  PROFILE: "/profile",
  BOOKMARKED_MODULES: "/bookmarked-modules",
  USER_CREATE: "/users/create",
  USER_DETAILS: (id: string) => `/users/${id}`,
  USER_EDIT: (id: string) => `/users/${id}/edit`,
  USER_EDIT_ROLE: (id: string) => `/users/${id}/edit/role`,
  USER_EDIT_ORGANIZATION: (id: string) => `/users/${id}/edit/organization`,

  ORGANIZATIONS: "/organizations",
  ORGANIZATION_CREATE: "/organizations/create",
  ORGANIZATION_DETAILS: (id: string) => `/organizations/${id}`,
  ORGANIZATION_EDIT: (id: string) => `/organizations/${id}/edit`,
  ORGANIZATION_EDIT_ADMIN: (id: string) => `/organizations/${id}/edit/admin`,
  ORGANIZATION_EDIT_USERS_ADD: (id: string) =>
    `/organizations/${id}/edit/users?type=add`,
  ORGANIZATION_EDIT_USERS_REMOVE: (id: string) =>
    `/organizations/${id}/edit/users?type=remove`,
  ORGANIZATION_EDIT_COURSES_ADD: (id: string) =>
    `/organizations/${id}/edit/courses?type=add`,
  ORGANIZATION_EDIT_COURSES_REMOVE: (id: string) =>
    `/organizations/${id}/edit/courses?type=remove`,

  COURSES: "/courses",
  COURSE_CREATE: "/courses/create",
  COURSE_FEEDBACKS: (id: string) => `/courses/${id}/feedbacks`,
  COURSE_DETAILS: (id: string) => `/courses/${id}`,
  COURSE_EDIT: (id: string) => `/courses/${id}/edit`,

  LESSON_CREATE: (courseId: string) => `/courses/${courseId}/lessons/create`,
  LESSON_DETAILS: (courseId: string, lessonId: string) =>
    `/courses/${courseId}/lessons/${lessonId}`,
  LESSON_EDIT: (courseId: string, lessonId: string) =>
    `/courses/${courseId}/lessons/${lessonId}/edit`,

  MODULE_CREATE: (courseId: string, lessonId: string) =>
    `/courses/${courseId}/lessons/${lessonId}/modules/create`,
  MODULE_DETAILS: (courseId: string, lessonId: string, moduleId: string) =>
    `/courses/${courseId}/lessons/${lessonId}/modules/${moduleId}`,
  MODULE_EDIT: (courseId: string, lessonId: string, moduleId: string) =>
    `/courses/${courseId}/lessons/${lessonId}/modules/${moduleId}/edit`,

  QUIZZES: (courseId: string) => `/courses/${courseId}/quizzes`,
  QUIZ_CREATE: (courseId: string) => `/courses/${courseId}/quizzes/create`,
  QUIZ_DETAILS: (courseId: string, quizId: string) =>
    `/courses/${courseId}/quizzes/${quizId}`,
  QUIZ_EDIT: (courseId: string, quizId: string) =>
    `/courses/${courseId}/quizzes/${quizId}/edit`,
  QUESTION_CREATE: (courseId: string, quizId: string) =>
    `/courses/${courseId}/quizzes/${quizId}/questions/create`,
  QUESTION_EDIT: (courseId: string, quizId: string, questionId: string) =>
    `/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/edit`,

  CODE_ASSESSMENTS: (courseId: string) =>
    `/courses/${courseId}/code-assessments`,
  CODE_ASSESSMENT_CREATE: (courseId: string) =>
    `/courses/${courseId}/code-assessments/create`,
  CODE_ASSESSMENT_DETAILS: (courseId: string, id: string) =>
    `/courses/${courseId}/code-assessments/${id}`,
  CODE_ASSESSMENT_EDIT: (courseId: string, id: string) =>
    `/courses/${courseId}/code-assessments/${id}/edit`,
  TEST_CASE_CREATE: (courseId: string, codeAssessmentId: string) =>
    `/courses/${courseId}/code-assessments/${codeAssessmentId}/test-cases/create`,
  TEST_CASE_EDIT: (courseId: string, codeAssessmentId: string, id: string) =>
    `/courses/${courseId}/code-assessments/${codeAssessmentId}/test-cases/${id}/edit`,
};

export const apiRoutes = {
  // Users
  USERS: "/users",
  USERS_NON_ORGANIZATION: "/users/non-organization-users",
  USER_LOGIN: "/users/login",
  USER_ENROLL_COURSE: "/users/enroll-course",
  USER_BOOKMARK_MODULE: "/users/bookmark-module",
  USER_MARK_MODULE_AS_COMPLETE: "/users/mark-module-as-complete",
  USER_BOOKMARKED_MODULES: "/users/bookmarked-modules",
  USER_DASHBOARD_STATS: "/users/dashboard-stats",
  USERS_ID: (id: string) => `/users/${id}`,
  USER_PROGRESS: (id: string) => `/users/${id}/progress`,
  USER_ID_ORGANIZATION: (id: string) => `/users/${id}/organization`,
  USER_ID_ROLE: (id: string) => `/users/${id}/role`,
  // Organizations
  ORGANIZATIONS: "/organizations",
  ORGANIZATIONS_SEARCH: (name: string) => `/organizations/search?name=${name}`,
  ORGANIZATION_ID: (id: string) => `/organizations/${id}`,
  ORGANIZATION_ID_ORG_ADMIN: (id: string) => `/organizations/${id}/admin`,
  ORGANIZATION_ID_USERS: (id: string) => `/organizations/${id}/users`,
  ORGANIZATION_ID_COURSES: (id: string) => `/organizations/${id}/courses`,

  // Courses
  COURSES: "/courses",
  COURSES_NON_ORGANIZATION: "/courses/non-organization-courses",
  COURSE_ID: (id: string) => `/courses/${id}`,
  COURSE_FEEDBACK: (id: string) => `/courses/${id}/feedbacks`,

  // Lessons
  LESSONS: (courseId: string) => `/courses/${courseId}/lessons`,
  LESSON_ID: (courseId: string, id: string) =>
    `/courses/${courseId}/lessons/${id}`,
  // Modules
  MODULES: (courseId: string, lessonId: string) =>
    `/courses/${courseId}/lessons/${lessonId}/modules`,
  MODULE_ID: (courseId: string, lessonId: string, id: string) =>
    `/courses/${courseId}/lessons/${lessonId}/modules/${id}`,

  // Quizzes
  QUIZZES: (courseId: string) => `/courses/${courseId}/quizzes`,
  QUIZ_ID: (courseId: string, id: string) =>
    `/courses/${courseId}/quizzes/${id}`,
  // Questions
  QUESTIONS: (courseId: string, quizId: string) =>
    `/courses/${courseId}/quizzes/${quizId}/questions`,
  QUESTION_ID: (courseId: string, quizId: string, id: string) =>
    `/courses/${courseId}/quizzes/${quizId}/questions/${id}`,
  // Quiz Results
  QUIZ_RESULTS: (courseId: string, quizId: string) =>
    `/courses/${courseId}/quizzes/${quizId}/quiz-results`,
  QUIZ_RESULT_ID: (courseId: string, quizId: string, id: string) =>
    `/courses/${courseId}/quizzes/${quizId}/quiz-results/${id}`,

  // Code Assessments
  CODE_ASSESSMENTS: (courseId: string) =>
    `/courses/${courseId}/code-assessments`,
  CODE_ASSESSMENT_ID: (courseId: string, id: string) =>
    `/courses/${courseId}/code-assessments/${id}`,
  // Test Cases
  TEST_CASES: (courseId: string, codeAssessmentId: string) =>
    `/courses/${courseId}/code-assessments/${codeAssessmentId}/test-cases`,
  TEST_CASE_ID: (courseId: string, codeAssessmentId: string, id: string) =>
    `/courses/${courseId}/code-assessments/${codeAssessmentId}/test-cases/${id}`,
  // Code Solutions
  CODE_SOLUTIONS: (courseId: string, codeAssessmentId: string) =>
    `/courses/${courseId}/code-assessments/${codeAssessmentId}/code-solutions`,
  CODE_SOLUTION_ID: (courseId: string, codeAssessmentId: string, id: string) =>
    `/courses/${courseId}/code-assessments/${codeAssessmentId}/code-solutions/${id}`,
};
