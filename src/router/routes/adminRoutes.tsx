import type { RouteObject } from "react-router";
import Users from "@/components/users/Users.tsx";
import EditUserForm from "@/components/forms/edit-user/edit-user.tsx";
import Organizations from "@/components/organizations/Organizations.tsx";
import OrganizationsList from "@/components/organizations/OrganizationsList.tsx";
import OrganizationCreateForm from "@/components/organizations/OrganizationCreateForm.tsx";
import OrganizationEditForm from "@/components/organizations/OrganizationEditForm.tsx";
import Courses from "@/components/courses/Courses.tsx";
import {
  default as CourseCreateForm,
  default as CrourseCreateForm,
} from "@/components/courses/CrourseCreateForm.tsx";
import CourseFeedbacks from "@/components/courses/CourseFeedbacks.tsx";
import Lessons from "@/components/lessons/Lessons.tsx";
import LessonCreateForm from "@/components/lessons/LessonCreate.tsx";
import Modules from "@/components/modules/Modules.tsx";
import ModuleCreateForm from "@/components/modules/ModuleCreateForm.tsx";
import Quizzes from "@/components/quizzes/Quizzes.tsx";
import QuizCreateForm from "@/components/quizzes/QuizCreateForm.tsx";
import QuestionCreateForm from "@/components/quizzes/QuestionCreateForm.tsx";
import CodeAssestments from "@/components/code-assessments/CodeAssestments.tsx";
import CodeAssessmentCreateForm from "@/components/code-assessments/CodeAssessmentCreateForm.tsx";
import TestCaseCreateForm from "@/components/code-assessments/TestCases/TestCaseCreateForm.tsx";

export const adminRoutes: RouteObject[] = [
  {
    path: "users",
    element: <Users />,
    children: [
      {
        path: ":userId/edit/role",
        element: <EditUserForm type="role" />,
      },
      {
        path: ":userId/edit/organization",
        element: <EditUserForm type="organization" />,
      },
    ],
  },
  {
    path: "organizations",
    element: <Organizations />,
    children: [
      {
        index: true,
        element: <OrganizationsList />,
      },
      {
        path: "create",
        element: <OrganizationCreateForm />,
      },
      {
        path: ":organizationId/edit/courses",
        element: <OrganizationEditForm type="courses" />,
      },
    ],
  },
  {
    path: "courses",
    element: <Courses />,
    children: [
      {
        path: "create",
        element: <CrourseCreateForm />,
      },
    ],
  },
  {
    path: "courses/:courseId/edit",
    element: <CourseCreateForm type="edit" />,
  },
  {
    path: "courses/:courseId/feedbacks",
    element: <CourseFeedbacks />,
  },
  {
    path: "courses/:courseId/lessons",
    element: <Lessons />,
    children: [
      {
        path: "create",
        element: <LessonCreateForm />,
      },
      {
        path: ":lessonId/edit",
        element: <LessonCreateForm type="edit" />,
      },
    ],
  },
  {
    path: "courses/:courseId/lessons/:lessonId/modules",
    element: <Modules />,
    children: [
      {
        path: "create",
        element: <ModuleCreateForm />,
      },
      {
        path: ":moduleId/edit",
        element: <ModuleCreateForm type="edit" />,
      },
    ],
  },
  {
    path: "courses/:courseId/quizzes",
    element: <Quizzes />,
    children: [
      {
        path: "create",
        element: <QuizCreateForm />,
      },
      {
        path: ":quizId/edit",
        element: <QuizCreateForm type="edit" />,
      },
      {
        path: ":quizId/questions/create",
        element: <QuestionCreateForm />,
      },
      {
        path: ":quizId/questions/:questionId/edit",
        element: <QuestionCreateForm type="edit" />,
      },
    ],
  },
  {
    path: "courses/:courseId/code-assessments",
    element: <CodeAssestments />,
    children: [
      {
        path: "create",
        element: <CodeAssessmentCreateForm />,
      },
      {
        path: ":codeAssessmentId/edit",
        element: <CodeAssessmentCreateForm type="edit" />,
      },
      {
        path: ":codeAssessmentId/test-cases/create",
        element: <TestCaseCreateForm />,
      },
      {
        path: ":codeAssessmentId/test-cases/:testCaseId/edit",
        element: <TestCaseCreateForm type="edit" />,
      },
    ],
  },
];
