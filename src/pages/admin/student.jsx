import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  useGetStudentsQuery,
  useDeleteStudentMutation,
} from "../../services/api";
import StudentModal from "../../components/modal/student-modal";
import {
  FiTrash2,
  FiEdit2,
  FiPlus,
  FiUsers,
  FiSearch,
  FiChevronDown,
  FiAward,
  FiAlertCircle,
  FiUserX,
} from "react-icons/fi";

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const STATUS_STYLES = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  graduated: { pill: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  spillover: {
    pill: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  inactive: {
    pill: "bg-rose-50 text-rose-600 ring-rose-200",
    dot: "bg-rose-500",
  },
};

const STATUS_OPTIONS = ["all", "active", "graduated", "spillover", "inactive"];

const TABLE_COLS = [
  "Student",
  "Matric No.",
  "Department",
  "Adm. Year",
  "Level",
  "Status",
  "Actions",
];

const STAT_CARDS = [
  {
    key: "total",
    label: "Total",
    icon: FiUsers,
    color: "bg-indigo-500",
    ring: "ring-indigo-100",
  },
  {
    key: "graduated",
    label: "Graduated",
    icon: FiAward,
    color: "bg-emerald-500",
    ring: "ring-emerald-100",
  },
  {
    key: "spillover",
    label: "Spillover",
    icon: FiAlertCircle,
    color: "bg-amber-500",
    ring: "ring-amber-100",
  },
  {
    key: "inactive",
    label: "Inactive",
    icon: FiUserX,
    color: "bg-rose-500",
    ring: "ring-rose-100",
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function StatCard({ label, value, icon: Icon, color, ring }) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100
                     shadow-sm hover:shadow-md transition-shadow duration-200 ring-1 ${ring}`}
    >
      <div className={`shrink-0 p-2.5 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight tabular-nums">
          {value ?? 0}
        </p>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const key = (status || "inactive").toLowerCase();
  const style = STATUS_STYLES[key] ?? STATUS_STYLES.inactive;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
                      text-xs font-semibold ring-1 capitalize ${style.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      {status || "—"}
    </span>
  );
}

function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hue = ((name?.charCodeAt(0) || 0) * 37) % 360;
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0
                 text-xs font-bold select-none"
      style={{
        background: `hsl(${hue},55%,88%)`,
        color: `hsl(${hue},55%,32%)`,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function SkeletonTable({ rows = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-slate-50">
          {Array.from({ length: 7 }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className="h-3.5 bg-slate-100 rounded-full"
                style={{ width: `${55 + ((j * 13) % 40)}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* Mobile student card */
function MobileCard({ student, onEdit, onDelete, isDeleting }) {
  const name = student.user?.name || "—";
  return (
    <article
      className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3"
      aria-label={`Student: ${name}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={name} />
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate text-sm">
              {name}
            </p>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wide">
              {student.matric_number || "—"}
            </p>
          </div>
        </div>
        <StatusBadge status={student.status} />
      </div>

      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-center">
        {[
          { v: student.department?.name || "—", l: "Dept" },
          { v: student.admission_year || "—", l: "Year" },
          {
            v: student.current_level ? `${student.current_level}L` : "—",
            l: "Level",
          },
        ].map(({ v, l }) => (
          <div key={l}>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {l}
            </p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5 truncate">
              {v}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onEdit(student)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                     bg-indigo-50 text-indigo-600 text-xs font-bold
                     hover:bg-indigo-100 active:scale-95 transition-all duration-150"
          aria-label={`Edit ${name}`}
        >
          <FiEdit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={() => onDelete(student.id)}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                     bg-rose-50 text-rose-600 text-xs font-bold
                     hover:bg-rose-100 active:scale-95 transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Delete ${name}`}
        >
          <FiTrash2 className="w-3.5 h-3.5" />
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </article>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

function Student() {
  const { data: students = [], isLoading, isError } = useGetStudentsQuery();
  const [deleteStudent, { isLoading: isDeleting, originalArgs: deletingId }] =
    useDeleteStudentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ── Handlers ── */
  const openAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };
  const openEdit = (s) => {
    setSelectedStudent(s);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;
    try {
      await deleteStudent(id).unwrap();
      toast.success("Student deleted successfully.");
    } catch {
      toast.error("Failed to delete student.");
    }
  };

  /* ── Derived data ── */
  const stats = useMemo(
    () => ({
      total: (students || []).length,
      graduated: (students || []).filter((s) => s.status === "graduated")
        .length,
      spillover: (students || []).filter((s) => s.status === "spillover")
        .length,
      inactive: (students || []).filter((s) => s.status === "inactive").length,
    }),
    [students],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (students || []).filter((s) => {
      const matchSearch =
        !q ||
        s.user?.name?.toLowerCase().includes(q) ||
        s.matric_number?.toLowerCase().includes(q) ||
        s.department?.name?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [students, searchQuery, statusFilter]);

  /* ── Error state ── */
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <FiAlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <p className="text-slate-700 font-semibold">
            Failed to load students
          </p>
          <p className="text-slate-400 text-sm">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div
      className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Page Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.12em] uppercase text-indigo-500 mb-1">
              Academic Records
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-tight">
              Students
            </h1>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white
                       text-sm font-bold rounded-xl hover:bg-indigo-700 active:scale-95
                       transition-all duration-150 shadow-sm shadow-indigo-200 w-fit
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Add new student"
          >
            <FiPlus className="w-4 h-4" /> Add Student
          </button>
        </header>

        {/* ── Stats ── */}
        <section
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          aria-label="Student statistics"
        >
          {STAT_CARDS.map(({ key, label, icon, color, ring }) => (
            <StatCard
              key={key}
              label={label}
              value={stats[key]}
              icon={icon}
              color={color}
              ring={ring}
            />
          ))}
        </section>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 px-4 sm:px-5 py-4 border-b border-slate-100">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=" Search by name, matric, department…"
                className="w-full pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                           outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                           placeholder:text-slate-400 text-slate-700 transition-all duration-200"
                aria-label="Search students"
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>

            <div className="flex gap-2 items-center">
              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200
                             rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                             text-slate-700 cursor-pointer transition-all duration-200"
                  aria-label="Filter by status"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s === "all"
                        ? "All Status"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              {/* Count badge */}
              {!isLoading && (
                <span className="hidden sm:inline-flex shrink-0 text-xs text-slate-400 font-medium whitespace-nowrap">
                  {filtered.length} / {students.length}
                </span>
              )}
            </div>
          </div>

          {/* ── Mobile Cards (< md) ── */}
          <div className="md:hidden p-4 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse p-4 rounded-2xl border border-slate-100 bg-white space-y-3"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-slate-100 rounded-full w-3/5" />
                        <div className="h-3 bg-slate-100 rounded-full w-2/5" />
                      </div>
                    </div>
                    <div className="h-12 bg-slate-50 rounded-xl" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-8 bg-slate-100 rounded-xl" />
                      <div className="h-8 bg-slate-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <FiUsers className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">
                  {searchQuery || statusFilter !== "all"
                    ? "No students match your filters."
                    : "No students yet. Add one to get started."}
                </p>
              </div>
            ) : (
              filtered.map((student) => (
                <MobileCard
                  key={student.id}
                  student={student}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  isDeleting={isDeleting && deletingId === student.id}
                />
              ))
            )}
          </div>

          {/* ── Desktop Table (≥ md) ── */}
          <div className="hidden md:block overflow-x-auto">
            <table
              className="w-full text-sm text-left"
              role="table"
              aria-label="Students table"
            >
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {TABLE_COLS.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <SkeletonTable rows={6} />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-16 text-slate-400"
                    >
                      <FiUsers className="w-10 h-10 mx-auto mb-3 opacity-25" />
                      <p className="text-sm font-semibold">
                        {searchQuery || statusFilter !== "all"
                          ? "No students match your filters."
                          : "No students found. Add one to get started."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((student) => {
                    const isDeletingThis =
                      isDeleting && deletingId === student.id;
                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/80 transition-colors duration-100 group"
                      >
                        {/* Name */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={student.user?.name} />
                            <span className="font-semibold text-slate-800 whitespace-nowrap">
                              {student.user?.name || "—"}
                            </span>
                          </div>
                        </td>
                        {/* Matric */}
                        <td className="px-4 py-3.5 font-mono text-xs text-slate-500 uppercase tracking-wide whitespace-nowrap">
                          {student.matric_number || "—"}
                        </td>
                        {/* Department */}
                        <td className="px-4 py-3.5 text-slate-500 max-w-45 truncate">
                          {student.user?.department?.name || "—"}
                        </td>
                        {/* Year */}
                        <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                          {student.admission_year || "—"}
                        </td>
                        {/* Level */}
                        <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                          {student.level ? `${student.level}L` : "—"}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <StatusBadge status={student.status} />
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEdit(student)}
                              aria-label={`Edit ${student.user?.name}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold
                                         text-indigo-600 bg-indigo-50 rounded-lg
                                         hover:bg-indigo-100 active:scale-95 transition-all duration-150
                                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              disabled={isDeletingThis}
                              aria-label={`Delete ${student.user?.name}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold
                                         text-rose-600 bg-rose-50 rounded-lg
                                         hover:bg-rose-100 active:scale-95 transition-all duration-150
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                              {isDeletingThis ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!isLoading && filtered.length > 0 && (
            <div className="px-5 py-3.5 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400 font-medium">
                Showing{" "}
                <strong className="text-slate-600">{filtered.length}</strong> of{" "}
                <strong className="text-slate-600">{students.length}</strong>{" "}
                students
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={selectedStudent || []}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
}

export default Student;
