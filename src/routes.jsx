import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/admin/dashboard";
import NotFound from "./pages/notfound";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import Faculty from "./pages/admin/faculty";
import AddFaculty from "./pages/admin/add-faculty";
import Department from "./pages/admin/department";
import Student from "./pages/admin/student";
import Courses from "./pages/admin/courses";
import CourseRegistration from "./pages/course-registration";
import CourseModal from "./components/modal/course-modal";
import TestPage from "./pages/test";
import StudentDashboard from "./pages/student/dashboard";
import StudentLayout from "./layouts/StudentLayout";
import AcademicSettings from "./pages/admin/settings/academic-settings";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />

        {/* Protected Route */}
        <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/settings/academic" element={<AcademicSettings />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/faculty" element={<Faculty />} />
            <Route path="/admin/faculty/add" element={<AddFaculty />} />
            {/* DEPARTMENTS ROUTES */}
            <Route path="/admin/department" element={<Department />} />
            {/* STUDENTS ROUTES */}
            <Route path="/admin/students" element={<Student />} />
            {/* Couses ROUTES */}
            <Route path="/admin/courses" element={<Courses />} />
            <Route path="/admin/courses/add" element={<CourseModal />} />
            <Route
              path="/admin/course/registration"
              element={<CourseRegistration />}
            />
          </Route>

          {/* Student Routes */}
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
