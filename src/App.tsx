import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./App.css";
import "./assets/fonts/Poppins/style.css";
import "./assets/fonts/Roboto/style.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { queryClient } from "./react-query";

import PrivateRoute from "./Routes/PrivateRoute";
import Layout from "./Theme/Layout";
import Messages from "./Theme/Messages";

import ForgotPassword from "./pages/ForgetPassword";
import LoginPage from "./pages/Login";
import UserSearchPage from "./pages/UserSearchPage";

import StudentAssignment from "./pages/Student/StudentAssignment";
import AssignmentSubmissionPage from "./pages/Student/StudentAssignmentDetail";
import StudentCourses from "./pages/Student/StudentCourses";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentRoutine from "./pages/Student/StudentRoutine";

import Error404 from "./components/Error404";
import StudentCourseLessons from "./pages/Student/StudentLesson";
import StudentResult from "./pages/Student/StudentResult";
import TeacherAssignment from "./pages/Teacher/TeacherAssignment";
import AssignmentDetails from "./pages/Teacher/TeacherAssignmentDetail";
import TeacherCourses from "./pages/Teacher/TeacherCourses";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import TeacherCourseLessons from "./pages/Teacher/TeacherLesson";
import TeacherStudentList from "./pages/Teacher/TeacherStudentList";
import { theme } from "./theme";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" zIndex={1000} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/forget_password/:uid/:token"
              element={<ForgotPassword />}
            />
          </Routes>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="users/search" element={<UserSearchPage />} />
              <Route
                path="message/:receiverID"
                element={<PrivateRoute component={Messages} type="all" />}
              />

              <Route path="student">
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute component={StudentDashboard} type="student" />
                  }
                />
                <Route
                  path="routine"
                  element={
                    <PrivateRoute component={StudentRoutine} type="student" />
                  }
                />
                <Route
                  path="result"
                  element={
                    <PrivateRoute component={StudentResult} type="student" />
                  }
                />
                <Route
                  path="assignment"
                  element={
                    <PrivateRoute
                      component={StudentAssignment}
                      type="student"
                    />
                  }
                />

                <Route
                  path="assignment/:assignmentID"
                  element={
                    <PrivateRoute
                      component={AssignmentSubmissionPage}
                      type="student"
                    />
                  }
                />

                <Route
                  path="course"
                  element={
                    <PrivateRoute component={StudentCourses} type="student" />
                  }
                />
                <Route
                  path="course/:courseID/lessons"
                  element={
                    <PrivateRoute
                      component={StudentCourseLessons}
                      type="student"
                    />
                  }
                />
              </Route>

              <Route path="teacher">
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute component={TeacherDashboard} type="teacher" />
                  }
                />
                <Route
                  path="assignment"
                  element={
                    <PrivateRoute
                      component={TeacherAssignment}
                      type="teacher"
                    />
                  }
                />
                <Route
                  path="assignment/:assignmentID"
                  element={
                    <PrivateRoute
                      component={AssignmentDetails}
                      type="teacher"
                    />
                  }
                />
                <Route
                  path="students"
                  element={
                    <PrivateRoute
                      component={TeacherStudentList}
                      type="teacher"
                    />
                  }
                />
                <Route
                  path="course"
                  element={
                    <PrivateRoute component={TeacherCourses} type="teacher" />
                  }
                />
                <Route
                  path="course/:courseID/lessons"
                  element={
                    <PrivateRoute
                      component={TeacherCourseLessons}
                      type="teacher"
                    />
                  }
                />
              </Route>
            </Route>
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
