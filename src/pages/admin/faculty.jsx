import React, { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import {
  FiTrash,
  FiEdit2,
  FiPlus,
  FiDownload,
  FiSearch,
  FiUsers,
  FiBook,
  FiLayers,
  FiGrid,
} from "react-icons/fi";
import {
  useGetFacultiesQuery,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useAddFacultyMutation,
} from "../../services/api";
import FacultyModal from "../../components/modal/faculty-modal";
import { StatCard2 as StatCard } from "../../components/stat-card2";
import { facultyCSS } from "./faculty-css";

/* ─── Constants ─────────────────────────────────────────────────────────── */

const STATS_CONFIG = [
  {
    key: "faculties",
    label: "Faculties",
    icon: FiGrid,
    classes:
      "bg-linear-to-r from-gray-800 via-gray-500 to-gray-400 shadow-lg transition-all duration-300",
    delay: "stagger-1",
  },
  {
    key: "departments",
    label: "Departments",
    icon: FiLayers,
    classes:
      "bg-linear-to-b from-gray-800 via-gray-600 to-gray-400 shadow-lg transition-all duration-300",
    delay: "stagger-2",
  },
  {
    key: "students",
    label: "Students",
    icon: FiUsers,
    classes:
      "bg-linear-to-l from-gray-800 via-gray-600 to-gray-400 shadow-lg transition-all duration-300",
    delay: "stagger-3",
  },
  {
    key: "courses",
    label: "Courses",
    icon: FiBook,
    classes:
      "bg-linear-to-t from-gray-700 via-gray-600 to-gray-300 shadow-lg transition-all duration-300",
    delay: "stagger-4",
  },
];

const TABLE_HEADERS = ["Faculty", "Departments", "Status", "Actions"];

/* ─── Sub-components ────────────────────────────────────────────────────── */

function FacultyAvatar({ name }) {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  const hue = ((name?.charCodeAt(0) || 0) * 37) % 360;
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        background: `hsl(${hue},55%,88%)`,
        color: `hsl(${hue},55%,32%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 13,
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i}>
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="skeleton"
            style={{ width: 38, height: 38, borderRadius: 12 }}
          />
          <div>
            <div
              className="skeleton"
              style={{ width: 160, height: 14, marginBottom: 6 }}
            />
            <div className="skeleton" style={{ width: 60, height: 10 }} />
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 20px" }}>
        <div className="skeleton" style={{ width: 80, height: 14 }} />
      </td>
      <td style={{ padding: "14px 20px" }}>
        <div
          className="skeleton"
          style={{ width: 60, height: 24, borderRadius: 999 }}
        />
      </td>
      <td style={{ padding: "14px 20px" }}>
        <div
          className="skeleton"
          style={{
            width: 70,
            height: 32,
            borderRadius: 10,
            marginLeft: "auto",
          }}
        />
      </td>
    </tr>
  ));
}

function ActiveBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 999,
        background: "var(--teal-light)",
        color: "var(--teal)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
      }}
    >
      <span
        className="pulse-dot"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "currentColor",
          display: "inline-block",
        }}
      />
      Active
    </span>
  );
}

function ActionButton({
  onClick,
  ariaLabel,
  title,
  variant = "edit",
  children,
}) {
  const isEdit = variant === "edit";
  const baseStyle = {
    padding: isEdit ? "8px 14px" : "8px 10px",
    borderRadius: 10,
    border: "1.5px solid var(--border)",
    background: "var(--card)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    transition: "background 0.15s, border-color 0.15s",
    fontFamily: "'DM Sans',sans-serif",
    color: isEdit ? "var(--teal)" : "#ef4444",
  };
  const hoverStyle = isEdit
    ? { background: "var(--teal-light)", borderColor: "var(--teal)" }
    : { background: "#fff1f2", borderColor: "#fca5a5" };
  const restoreStyle = {
    background: "var(--card)",
    borderColor: "var(--border)",
  };

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      style={baseStyle}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, restoreStyle)}
    >
      {children}
    </button>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */

function Faculty() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [search, setSearch] = useState("");

  // RTK Query — data fetching, caching, and loading state all in one
  const { data: faculties = [], isLoading } = useGetFacultiesQuery();
  const [updateFaculty, { isLoading: isSubmitting }] =
    useUpdateFacultyMutation();
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [addFaculty] = useAddFacultyMutation();

  const filtered = faculties.filter(
    (f) =>
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.abbreviation?.toLowerCase().includes(search.toLowerCase()),
  );

  const statsValues = {
    faculties: faculties.length,
    departments: 26,
    students: "4.8k",
    courses: 314,
  };

  /* ── Handlers ── */

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedFaculty) {
        await updateFaculty({ id: selectedFaculty.id, ...formData }).unwrap();
        toast.success("Faculty updated successfully");
      } else {
        await addFaculty(formData).unwrap();
        toast.success("Faculty created successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty? This action cannot be undone."))
      return;
    try {
      await deleteFaculty(id).unwrap();
      toast.success("Faculty deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ── Render ── */
  return (
    <>
      <style>{facultyCSS}</style>
      <div
        className="faculty-root"
        style={{
          minHeight: "100vh",
          background: "var(--surface)",
          padding: "28px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* ── Header ── */}
          <header
            className="animate-fade-up"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--teal)",
                  marginBottom: 4,
                }}
              >
                Academic Structure
              </p>
              <h1
                style={{
                  fontSize: "clamp(28px,5vw,40px)",
                  fontWeight: 400,
                  color: "var(--ink)",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Faculties
              </h1>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="btn-ghost"
                aria-label="Import faculties"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 12,
                  border: "1.5px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--ink-muted)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <FiDownload size={16} /> Import
              </button>
              <button
                // to="/admin/faculty/add"
                className="btn-primary"
                aria-label="Add new faculty"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#f59e0b,#d97706)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
                }}
                onClick={() => setIsModalOpen(true)}
              >
                <FiPlus size={18} /> Add Faculty
              </button>
            </div>
          </header>

          {/* ── Stats ── */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 14,
            }}
            aria-label="Summary statistics"
          >
            {STATS_CONFIG.map(({ key, label, icon, classes, delay }) => (
              <StatCard
                key={key}
                label={label}
                value={statsValues[key]}
                icon={icon}
                classes={classes}
                delay={delay}
              />
            ))}
          </section>

          {/* ── Table Card ── */}
          <div
            className="animate-fade-up stagger-5"
            style={{
              background: "var(--card)",
              borderRadius: 24,
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {/* Toolbar */}
            <div
              className="bg-white/30 backdrop-blur-md"
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <label
                style={{
                  position: "relative",
                  flex: "1 1 220px",
                  maxWidth: 340,
                }}
                aria-label="Search faculties"
              >
                <FiSearch
                  size={15}
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ink-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  className="search-input"
                  type="search"
                  placeholder="Search faculties…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: 38,
                    paddingRight: 16,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderRadius: 12,
                    border: "1.5px solid var(--border)",
                    background: "var(--surface)",
                    fontSize: 14,
                    color: "var(--ink)",
                    outline: "none",
                    transition: "box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                />
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {[
                  { opts: ["All Faculties"] },
                  { opts: ["Newest first", "Oldest first", "A–Z"] },
                ].map((sel, i) => (
                  <select
                    key={i}
                    style={{
                      padding: "9px 14px",
                      borderRadius: 11,
                      border: "1.5px solid var(--border)",
                      background: "var(--card)",
                      fontSize: 13,
                      color: "var(--ink-muted)",
                      cursor: "pointer",
                      outline: "none",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {sel.opts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "8px 0" }} className="bg-gray-100">
              {/* Loading */}
              {isLoading && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <SkeletonRows />
                    </tbody>
                  </table>
                </div>
              )}

              {/* Empty */}
              {!isLoading && filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "64px 24px" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <FiGrid size={26} color="#94a3b8" />
                  </div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {search ? "No results found" : "No faculties yet"}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    {search
                      ? "Try a different search term."
                      : `Click "Add Faculty" to get started.`}
                  </p>
                </div>
              )}

              {!isLoading && filtered.length > 0 && (
                <>
                  {/* Mobile Cards */}
                  <div
                    style={{ display: "grid", gap: 12, padding: "16px" }}
                    className="mobile-list"
                  >
                    <style>{`@media(min-width:768px){.mobile-list{display:none!important}}`}</style>
                    {filtered.map((faculty, i) => (
                      <article
                        key={faculty.id}
                        className="mobile-card animate-scale-in"
                        aria-label={`Faculty: ${faculty.name}`}
                        style={{
                          animationDelay: `${i * 0.04}s`,
                          borderRadius: 18,
                          border: "1.5px solid var(--border)",
                          background: "var(--surface)",
                          padding: "18px",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 14,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <FacultyAvatar name={faculty.abbreviation} />
                            <div>
                              <p
                                style={{
                                  fontWeight: 700,
                                  color: "var(--ink)",
                                  margin: 0,
                                  fontSize: 15,
                                }}
                              >
                                {faculty.name}
                              </p>
                              <span
                                className="tag"
                                style={{ color: "var(--ink-muted)" }}
                              >
                                {faculty.abbreviation}
                              </span>
                            </div>
                          </div>
                          <ActiveBadge />
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: 8,
                            background: "var(--card)",
                            borderRadius: 12,
                            padding: "12px",
                            marginBottom: 14,
                            textAlign: "center",
                          }}
                        >
                          {[
                            {
                              v: faculty?.departments?.length || 0,
                              l: "Depts",
                            },
                            { v: "65k", l: "Students" },
                            { v: "345", l: "Courses" },
                          ].map(({ v, l }) => (
                            <div key={l}>
                              <p
                                style={{
                                  margin: 0,
                                  fontWeight: 800,
                                  fontSize: 18,
                                  color: "var(--ink)",
                                }}
                              >
                                {v}
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "var(--ink-muted)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.07em",
                                }}
                              >
                                {l}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleEdit(faculty)}
                            aria-label={`Edit ${faculty.name}`}
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6,
                              padding: "10px",
                              borderRadius: 12,
                              border: "none",
                              background:
                                "linear-gradient(135deg,#0d9488,#0f766e)",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(13,148,136,0.25)",
                              fontFamily: "'DM Sans',sans-serif",
                            }}
                          >
                            <FiEdit2 size={15} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(faculty.id)}
                            aria-label={`Delete ${faculty.name}`}
                            style={{
                              padding: "10px 14px",
                              borderRadius: 12,
                              border: "1.5px solid #fee2e2",
                              background: "#fff",
                              color: "#ef4444",
                              cursor: "pointer",
                            }}
                          >
                            <FiTrash size={16} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Desktop Table */}
                  <div className="desktop-table" style={{ overflowX: "auto" }}>
                    <style>{`@media(max-width:767px){.desktop-table{display:none!important}}`}</style>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                      role="table"
                      aria-label="Faculties table"
                    >
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          {TABLE_HEADERS.map((h, i) => (
                            <th
                              key={h}
                              style={{
                                padding: "12px 24px",
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--ink-muted)",
                                textAlign: i === 3 ? "right" : "left",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((faculty, i) => (
                          <tr
                            key={faculty.id}
                            className={`row-item animate-fade-up ${i % 2 === 0 ? "bg-gray-50" : ""}`}
                            style={{
                              animationDelay: `${i * 0.04}s`,
                              borderBottom: "1px solid var(--border)",
                            }}
                          >
                            <td style={{ padding: "16px 24px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 12,
                                }}
                              >
                                <FacultyAvatar name={faculty.name} />
                                <div>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontWeight: 700,
                                      color: "var(--ink)",
                                      fontSize: 14,
                                    }}
                                  >
                                    {faculty.name}
                                  </p>
                                  <span
                                    className="tag"
                                    style={{ color: "var(--ink-muted)" }}
                                  >
                                    {faculty.abbreviation}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "5px 12px",
                                  borderRadius: 8,
                                  background: "var(--teal-light)",
                                  color: "var(--teal)",
                                  fontSize: 13,
                                  fontWeight: 700,
                                }}
                              >
                                {faculty?.departments?.length || 0} depts
                              </span>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <ActiveBadge />
                            </td>
                            <td
                              style={{
                                padding: "16px 24px",
                                textAlign: "right",
                              }}
                            >
                              <div
                                className="row-actions"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: 4,
                                }}
                              >
                                <ActionButton
                                  onClick={() => handleEdit(faculty)}
                                  ariaLabel={`Edit ${faculty.name}`}
                                  title="Edit faculty"
                                  variant="edit"
                                >
                                  <FiEdit2 size={14} /> Edit
                                </ActionButton>
                                <ActionButton
                                  onClick={() => handleDelete(faculty.id)}
                                  ariaLabel={`Delete ${faculty.name}`}
                                  title="Delete faculty"
                                  variant="delete"
                                >
                                  <FiTrash size={15} />
                                </ActionButton>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      padding: "14px 24px",
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                      color: "var(--ink-muted)",
                      fontWeight: 500,
                    }}
                  >
                    <span>
                      Showing{" "}
                      <strong style={{ color: "var(--ink)" }}>
                        {filtered.length}
                      </strong>{" "}
                      of{" "}
                      <strong style={{ color: "var(--ink)" }}>
                        {faculties.length}
                      </strong>{" "}
                      faculties
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <FacultyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmit={handleSubmit}
        initialData={selectedFaculty}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default Faculty;
