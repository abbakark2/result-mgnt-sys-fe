import React, { useEffect } from "react";
import { Formik } from "formik";
import MainLayout from "../layouts/MainLayout";
import { loginSchema } from "../schema";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApi";

import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  selectIsAuthenticated,
  selectCurrentRole,
} from "../store/auth-slice";

function Login() {
  const navigate = useNavigate();
  const [loginApi, { isLoading: isSubmitting }] = useLoginMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const getRole = useSelector(selectCurrentRole);

  const submitForm = async (values, { setSubmitting }) => {
    try {
      const res = await loginApi(values).unwrap();

      if (res.token) {
        localStorage.setItem("ACCESS_TOKEN", res.token); // Store token securely
        dispatch(
          setCredentials({
            user: res.user,
            token: res.token,
            role: res.user.role.name,
          }),
        );
        toast.success("Login successful");
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (error) {
      const message =
        error.data?.message || "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from) {
      toast("Please sign in to continue.");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (getRole === "super_admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (getRole === "student") {
        navigate("/student/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated]);
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl font-semibold mb-4 text-center">
            Admin Login
          </h1>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={submitForm}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="border p-2 rounded"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="border p-2 rounded"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-teal-600 text-white p-2 rounded disabled:bg-gray-400"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </MainLayout>
  );
}

export default Login;
