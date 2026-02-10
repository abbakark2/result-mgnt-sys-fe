import React, { useEffect } from "react";
import { Formik } from "formik";
import MainLayout from "../layouts/MainLayout";
import { loginSchema } from "../schema";
import axiosClient from "../axios-client";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.ACCESS_TOKEN);

  // 🔐 Redirect authenticated users away from login
  useEffect(() => {
    if (accessToken) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [accessToken, navigate]);

  const submitForm = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      const res = await axiosClient.post("/login", values);
      if (res.data.token) {
        localStorage.setItem("ACCESS_TOKEN", res.data.token);
        dispatch(authActions.login(res.data.token));
        toast.success("Login successful");
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

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
              isSubmitting,
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
