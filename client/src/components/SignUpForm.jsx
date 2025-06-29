import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function SignupForm({ onSignup }) {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).required("Password is required"),
    image_url: Yup.string().url("Must be a valid URL"),
    bio: Yup.string().max(50),
  });

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          image_url: "",
          bio: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
          fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // if using session cookies
            body: JSON.stringify(values),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Signup failed");
              return res.json();
            })
            .then((user) => {
              onSignup(user);      // Save user to state
              navigate("/myday");  // Redirect
            })
            .catch((err) => {
              setErrors({ submit: err.message });
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <label>Username</label>
            <Field name="username" className="input" />
            <ErrorMessage name="username" component="div" />

            <label>Email</label>
            <Field name="email" className="input" />
            <ErrorMessage name="email" component="div" />

            <label>Password</label>
            <Field name="password" type="password" className="input" />
            <ErrorMessage name="password" component="div" />

            <label>Image URL</label>
            <Field name="image_url" className="input" />
            <ErrorMessage name="image_url" component="div" />

            <label>Bio</label>
            <Field name="bio" as="textarea" className="input" />
            <ErrorMessage name="bio" component="div" />

            {errors.submit && <div style={{ color: "red" }}>{errors.submit}</div>}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignupForm;