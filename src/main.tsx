import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App.tsx";
import CodeAssessmentCreateForm from "./components/code-assessments/CodeAssessmentCreateForm.tsx";
import CodeAssessmentDetails from "./components/code-assessments/CodeAssessmentDetails.tsx";
import CodeAssestments from "./components/code-assessments/CodeAssestments.tsx";
import TestCaseCreateForm from "./components/code-assessments/TestCaseCreateForm.tsx";
import CourseDetails from "./components/courses/CourseDetails.tsx";
import CourseFeedbacks from "./components/courses/CourseFeedbacks.tsx";
import Courses from "./components/courses/Courses.tsx";
import CoursesList from "./components/courses/CoursesList.tsx";
import {
  default as CourseCreateForm,
  default as CrourseCreateForm,
} from "./components/courses/CrourseCreateForm.tsx";
import Dashboard from "./components/Dashboard/Dashboard.tsx";
import AddUserForm from "./components/forms/add-user/add-user.tsx";
import EditUserForm from "./components/forms/edit-user/edit-user.tsx";
import LoginForm from "./components/forms/login.tsx";
import LessonCreateForm from "./components/lessons/LessonCreate.tsx";
import LessonDetails from "./components/lessons/LessonDetails.tsx";
import Lessons from "./components/lessons/Lessons.tsx";
import BookMarkedModules from "./components/modules/BookMarkedModules.tsx";
import ModuleCreateForm from "./components/modules/ModuleCreateForm.tsx";
import ModuleDetails from "./components/modules/ModuleDetails.tsx";
import Modules from "./components/modules/Modules.tsx";
import OrganizationCreateForm from "./components/organizations/OrganizationCreateForm.tsx";
import OrganizationEditForm from "./components/organizations/OrganizationEditForm.tsx";
import Organizations from "./components/organizations/Organizations.tsx";
import OrganizationsList from "./components/organizations/OrganizationsList.tsx";
import ProtectedRoutesWrapper from "./components/ProtectedRoutesWrapper/ProtectedRoutesWrapper.tsx";
import QuestionCreateForm from "./components/quizzes/QuestionCreateForm.tsx";
import QuizCreateForm from "./components/quizzes/QuizCreateForm.tsx";
import QuizDetails from "./components/quizzes/QuizDetails.tsx";
import Quizzes from "./components/quizzes/Quizzes.tsx";
import Profile from "./components/users/Profile.tsx";
import UserDetails from "./components/users/UserDetails.tsx";
import Users from "./components/users/Users.tsx";
import UsersList from "./components/users/UsersList.tsx";
import Error from "./containers/error/error.tsx";
import AdminRoutes from "./containers/Routes/AdminRoutes.tsx";
import OrgAdminRoutes from "./containers/Routes/OrgAdminRoutes.tsx";
import ProtectedRoutes from "./containers/Routes/ProtectedRoutes.tsx";
import "./index.css";
import AuthProvider from "./providers/AuthProvider.tsx";
import { QueryClientProvider } from "./providers/QueryClientProvider.tsx";
import OrganizationDetails from "./components/organizations/OrganizationDetails/OrganizationDetials.tsx";

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
              // Organization Admin Routes
              {
                path: "/",
                element: <OrgAdminRoutes />,
                children: [
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
                    ],
                  },
                  {
                    path: "organizations",
                    element: <Organizations />,
                    children: [
                      {
                        path: ":organizationId",
                        element: <OrganizationDetails />,
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
                    ],
                  },
                ],
              },
              // Admin Routes
              {
                path: "/",
                element: <AdminRoutes />,
                children: [
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
                ],
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
