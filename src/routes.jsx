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
import CourseModal from "./components/modal/course-modal";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
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
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
