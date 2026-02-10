import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axiosClient from "../../axios-client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function AddFaculty() {
  const navigate = useNavigate();
  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Make API call to add faculty
      const res = await axiosClient.post("/admin/faculties", values);
      console.log("Submitting faculty:", res.data);
      toast.success(res.data.message || "New Faculty added successfully");
      //reset form input fields
      resetForm();
      setTimeout(() => {
        navigate("/admin/faculty");
      }, 2000);
      // Example: await axiosClient.post("/faculties", values);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding faculty",
      );
      console.error("Error adding faculty:", error);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Add New Faculty</h1>
        <Formik
          initialValues={{ name: "", abbreviation: "" }}
          onSubmit={handleSubmit}
          validationSchema={Yup.object({
            name: Yup.string().required("Faculty name is required"),
            abbreviation: Yup.string()
              .required("Abbreviation is required")
              .max(10, "Abbreviation is too long"),
          })}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <h1>
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                      <span className="text-indigo-500 font-medium">
                        Adding faculty...
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </h1>
                <label className="block text-sm font-medium mb-1">
                  Faculty Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur} // Added this
                  value={values.name}
                  className={`w-full border rounded px-3 py-2 ${
                    touched.name && errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.name && errors.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Abbreviation Field */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Abbreviation
                </label>
                <input
                  type="text"
                  name="abbreviation"
                  onChange={handleChange}
                  onBlur={handleBlur} // Added this
                  value={values.abbreviation}
                  className={`w-full border rounded px-3 py-2 ${
                    touched.abbreviation && errors.abbreviation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {touched.abbreviation && errors.abbreviation && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.abbreviation}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-500 text-white px-4 py-2 rounded"
              >
                {isSubmitting ? "Adding faculty..." : "Add Faculty"}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
