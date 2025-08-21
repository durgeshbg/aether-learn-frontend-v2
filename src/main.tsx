import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";
import App from "./App.tsx";
import LoginForm from "./components/forms/login.tsx";
import { QueryClientProvider } from "./providers/QueryClientProvider.tsx";
import ProtectedRoutes from "./containers/Routes/ProtectedRoutes.tsx";
import AuthProvider from "./providers/AuthProvider.tsx";
import ProtectedRoutesWrapper from "./components/ProtectedRoutesWrapper/ProtectedRoutesWrapper.tsx";
import Error from "./containers/error/error.tsx";
import Users from "./components/users/Users.tsx";
import Profile from "./components/users/Profile.tsx";
import UsersList from "./components/users/UsersList.tsx";
import AddUserForm from "./components/forms/add-user/add-user.tsx";
import EditUserForm from "./components/forms/edit-user/edit-user.tsx";
import UserDetails from "./components/users/UserDetails.tsx";
import Organizations from "./components/organizations/Organizations.tsx";
import OrganizationCreateForm from "./components/organizations/OrganizationCreateForm.tsx";
import OrganizationDetials from "./components/organizations/OrganizationDetials.tsx";
import OrganizationsList from "./components/organizations/OrganizationsList.tsx";
import OrganizationEditForm from "./components/organizations/OrganizationEditForm.tsx";
import Courses from "./components/courses/Courses.tsx";
import CoursesList from "./components/courses/CoursesList.tsx";
import CrourseCreateForm from "./components/courses/CrourseCreateForm.tsx";
import CourseDetails from "./components/courses/CourseDetails.tsx";
import Lessons from "./components/lessons/Lessons.tsx";
import LessonCreateForm from "./components/lessons/LessonCreate.tsx";
import LessonDetails from "./components/lessons/LessonDetails.tsx";
import Modules from "./components/modules/Modules.tsx";
import ModuleCreateForm from "./components/modules/ModuleCreateForm.tsx";
import ModuleDetails from "./components/modules/ModuleDetails.tsx";
import Quizzes from "./components/quizzes/Quizzes.tsx";
import QuizCreateForm from "./components/quizzes/QuizCreateForm.tsx";
import QuizDetails from "./components/quizzes/QuizDetails.tsx";
import QuestionCreateForm from "./components/quizzes/QuestionCreateForm.tsx";
import CodeAssestments from "./components/code-assessments/CodeAssestments.tsx";
import CodeAssessmentCreateForm from "./components/code-assessments/CodeAssessmentCreateForm.tsx";
import CodeAssessmentDetails from "./components/code-assessments/CodeAssessmentDetails.tsx";
import TestCaseCreateForm from "./components/code-assessments/TestCaseCreateForm.tsx";
import Dashboard from "./components/Dashboard/Dashboard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "/",
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/",
            element: <ProtectedRoutesWrapper />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
              {
                path: "users",
                element: <Users />,
                children: [
                  {
                    index: true,
                    element: <UsersList />,
                  },
                  {
                    path: "create",
                    element: <AddUserForm />,
                  },
                  {
                    path: ":userId",
                    element: <UserDetails />,
                  },
                  {
                    path: ":userId/edit",
                    element: <EditUserForm />,
                  },
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
                    path: ":organizationId",
                    element: <OrganizationDetials />,
                  },
                  {
                    path: ":organizationId/edit",
                    element: <OrganizationEditForm />,
                  },
                  {
                    path: ":organizationId/edit/admin",
                    element: <OrganizationEditForm type="admin" />,
                  },
                  {
                    path: ":organizationId/edit/users",
                    element: <OrganizationEditForm type="users" />,
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
                    index: true,
                    element: <CoursesList />,
                  },
                  {
                    path: "create",
                    element: <CrourseCreateForm />,
                  },
                  {
                    path: ":courseId/edit",
                    element: <CrourseCreateForm type="edit" />,
                  },
                ],
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
                    path: "create",
                    element: <LessonCreateForm />,
                  },
                  {
                    path: ":lessonId",
                    element: <LessonDetails />,
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
                    path: ":moduleId",
                    element: <ModuleDetails />,
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
                    path: ":quizId",
                    element: <QuizDetails />,
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
                    path: ":codeAssessmentId",
                    element: <CodeAssessmentDetails />,
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
              {
                path: "profile",
                element: <Profile />,
              },
            ],
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
