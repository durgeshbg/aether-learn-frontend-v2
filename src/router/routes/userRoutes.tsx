import type { RouteObject } from "react-router";
import Dashboard from "@/components/Dashboard/Dashboard.tsx";
import Profile from "@/components/users/Profile.tsx";
import Users from "@/components/users/Users.tsx";
import EditUserForm from "@/components/forms/edit-user/edit-user.tsx";
import Courses from "@/components/courses/Courses.tsx";
import CoursesList from "@/components/courses/CoursesList.tsx";
import BookMarkedModules from "@/components/modules/BookMarkedModules.tsx";
import CourseDetails from "@/components/courses/CourseDetails.tsx";
import Lessons from "@/components/lessons/Lessons.tsx";
import LessonDetails from "@/components/lessons/LessonDetails.tsx";
import Modules from "@/components/modules/Modules.tsx";
import ModuleDetails from "@/components/modules/ModuleDetails.tsx";
import Quizzes from "@/components/quizzes/Quizzes.tsx";
import QuizDetails from "@/components/quizzes/QuizDetails.tsx";
import CodeAssestments from "@/components/code-assessments/CodeAssestments.tsx";
import CodeAssessmentDetails from "@/components/code-assessments/CodeAssessmentDetails.tsx";
import Submissions from "@/components/submissions/Submissions.tsx";
import { Navigate } from "react-router";
import QuizResultsTab from "@/components/submissions/Tabs/QuizResultsTab.tsx";
import SubmissionQuizzesList from "@/components/submissions/SubmissionQuizzesList.tsx";
import QuizResults from "@/components/submissions/QuizResults.tsx";
import QuizResultDetails from "@/components/submissions/QuizResultDetails.tsx";
import CodeSolutionsTab from "@/components/submissions/Tabs/CodeSolutionsTab.tsx";
import SubmissionAssessmentsList from "@/components/submissions/SubmissionAssessmentsList.tsx";
import CodeSolutions from "@/components/submissions/CodeSolutions.tsx";
import CodeSolutionDetails from "@/components/submissions/CodeSolutionDetails.tsx";

export const userRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "users",
    element: <Users />,
    children: [
      {
        path: ":userId/edit",
        element: <EditUserForm />,
      },
    ],
  },
  {
    path: "courses",
    element: <Courses />,
    children: [
      {
        index: true,
        element: <CoursesList />,
      },
    ],
  },
  {
    path: "bookmarked-modules",
    element: <BookMarkedModules />,
  },
  {
    path: "courses/:courseId",
    element: <CourseDetails />,
  },
  {
    path: "courses/:courseId/lessons",
    element: <Lessons />,
    children: [
      {
        path: ":lessonId",
        element: <LessonDetails />,
      },
    ],
  },
  {
    path: "courses/:courseId/lessons/:lessonId/modules",
    element: <Modules />,
    children: [
      {
        path: ":moduleId",
        element: <ModuleDetails />,
      },
    ],
  },
  {
    path: "courses/:courseId/quizzes",
    element: <Quizzes />,
    children: [
      {
        path: ":quizId",
        element: <QuizDetails />,
      },
    ],
  },
  {
    path: "courses/:courseId/code-assessments",
    element: <CodeAssestments />,
    children: [
      {
        path: ":codeAssessmentId",
        element: <CodeAssessmentDetails />,
      },
    ],
  },
  {
    path: "courses/:courseId/submissions",
    element: <Submissions />,
    children: [
      {
        index: true,
        element: <Navigate to="quizzes" replace />,
      },
      {
        path: "quizzes",
        element: <QuizResultsTab />,
        children: [
          {
            index: true,
            element: <SubmissionQuizzesList />,
          },
          {
            path: ":quizId",
            element: <QuizResults />,
          },
          {
            path: ":quizId/results/:quizResultId",
            element: <QuizResultDetails />,
          },
        ],
      },
      {
        path: "code-assessments",
        element: <CodeSolutionsTab />,
        children: [
          {
            index: true,
            element: <SubmissionAssessmentsList />,
          },
          {
            path: ":codeAssessmentId",
            element: <CodeSolutions />,
          },
          {
            path: ":codeAssessmentId/solutions/:codeSolutionId",
            element: <CodeSolutionDetails />,
          },
        ],
      },
    ],
  },
];

