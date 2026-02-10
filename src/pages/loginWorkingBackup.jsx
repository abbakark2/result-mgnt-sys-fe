import React from "react";
import { useFormik } from "formik";
import MainLayout from "../layouts/MainLayout";
import "../App.css";
import { loginSchema } from "../schema";

const onSubmit = () => {
  console.log("submitted successfully");
};

function Login() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  return (
    <MainLayout>
      <div className="m-4 p-4">
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="please enter your email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <p className="text-red-500">
              {errors.email && touched.email && errors.email}
            </p>

            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Please enter your password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <p className="text-red-500">
              {errors.password && touched.password && errors.password}
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-4 rounded-lg text-white bg-teal-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default Login;
