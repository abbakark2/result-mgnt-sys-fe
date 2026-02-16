import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "../../axios-client";
import { studentActions } from "../../store/student-slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/breadcrumb";
import StudentModal from "../../components/modal/student-modal";
import {
  FiTrash2,
  FiEdit2,
  FiPlus,
  FiUsers,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white
                 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-tight">
          {value}
        </p>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  graduated: "bg-sky-50 text-sky-700 ring-sky-200",
  spillover: "bg-amber-50 text-amber-700 ring-amber-200",
  inactive: "bg-red-50 text-red-600 ring-red-200",
};

function StatusBadge({ status }) {
  const s = (status || "inactive").toLowerCase();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                 ring-1 capitalize ${STATUS_STYLES[s] ?? STATUS_STYLES.inactive}`}
    >
      {status || "—"}
    </span>
  );
}

// ── Skeleton Row ───────────────────────────────────────────────────────────────
function SkeletonRows({ count = 5 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: 7 }).map((__, j) => (
        <td key={j} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  ));
}

// ── Main Page ──────────────────────────────────────────────────────────────────
function Student() {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.student.students);
  const isLoading = useSelector((state) => state.student.isLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState(null); // tracks which row is being deleted

  const fetchStudents = async () => {
    try {
      dispatch(studentActions.setIsLoading(true));
      const res = await axiosClient.get("/admin/students");
      dispatch(studentActions.setStudents(res.data.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch students.");
    } finally {
      dispatch(studentActions.setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this student? This action cannot be undone.",
      )
    )
      return;
    setDeleteId(id);
    try {
      await axiosClient.delete(`/admin/students/${id}`);
      toast.success("Student deleted successfully.");
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete student.");
    } finally {
      setDeleteId(null);
    }
  };

  const openAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const openEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // ── Derived stats ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = students.length;
    const graduated = students.filter((s) => s.status === "graduated").length;
    const spillover = students.filter((s) => s.status === "spillover").length;
    const inactive = students.filter((s) => s.status === "inactive").length;
    return { total, graduated, spillover, inactive };
  }, [students]);

  // ── Filtered students ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        !q ||
        s.user?.name?.toLowerCase().includes(q) ||
        s.matric_number?.toLowerCase().includes(q) ||
        s.department?.name?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [students, searchQuery, statusFilter]);

  return (
    <div
      className="min-h-screen bg-slate-50 p-6"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Students
          </h1>
          <Breadcrumb currentPage="Students" />
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm
                     font-semibold rounded-xl hover:bg-indigo-700 active:scale-95
                     transition-all duration-150 shadow-sm shadow-indigo-200 w-fit"
        >
          <FiPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Students"
          value={stats.total}
          icon={FiUsers}
          color="bg-indigo-500"
        />
        <StatCard
          label="Graduated"
          value={stats.graduated}
          icon={FiUsers}
          color="bg-emerald-500"
        />
        <StatCard
          label="Spillover"
          value={stats.spillover}
          icon={FiUsers}
          color="bg-amber-500"
        />
        <StatCard
          label="Inactive"
          value={stats.inactive}
          icon={FiUsers}
          color="bg-rose-500"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-slate-100">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, matric, department…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg
                         outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                         placeholder:text-slate-400 text-slate-700 transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-slate-50 border border-slate-200
                         rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                         text-slate-700 cursor-pointer transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="spillover">Spillover</option>
              <option value="inactive">Inactive</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>

          {filtered.length > 0 && (
            <p className="text-xs text-slate-400 self-center ml-auto whitespace-nowrap">
              {filtered.length} of {students.length} students
            </p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Name",
                  "Matric Number",
                  "Department",
                  "Admission Year",
                  "Level",
                  "Status",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <SkeletonRows count={6} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    <FiUsers className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                      {searchQuery || statusFilter !== "all"
                        ? "No students match your filters."
                        : "No students found. Add one to get started."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors duration-100 group"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">
                      {student.user?.name || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 uppercase tracking-wide">
                      {student.matric_number || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">
                      {student.department?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {student.admission_year || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {student.current_level
                        ? `${student.current_level}L`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(student)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                     text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100
                                     transition-colors duration-150"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          disabled={deleteId === student.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                                     text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100
                                     transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          {deleteId === student.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedStudent}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        fetchStudents={fetchStudents}
      />
    </div>
  );
}

export default Student;
