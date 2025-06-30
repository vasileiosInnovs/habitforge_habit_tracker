import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  image_url: Yup.string().url("Must be a valid URL").nullable(),
  bio: Yup.string().max(150, "Bio must be at most 150 characters"),
});

function SignupForm({ onSignup }) {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
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
          fetch(`${process.env.REACT_APP_API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(values),
          })
            .then(async (res) => {
              if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Signup failed.");
              }
              return res.json();
            })
            .then((user) => {
              onSignup(user);
              toast.success("Signup successful!");
              resetForm();
              navigate("/myday");
            })
            .catch((err) => {
              toast.error(err.message);
              setErrors({ submit: err.message });
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form className="form">
            <label>Username</label>
            <Field name="username" className="input" />
            <ErrorMessage name="username" component="div" className="error" />

            <label>Email</label>
            <Field name="email" className="input" />
            <ErrorMessage name="email" component="div" className="error" />

            <label>Password</label>
            <Field name="password" type="password" className="input" />
            <ErrorMessage name="password" component="div" className="error" />

            <label>Image URL</label>
            <Field name="image_url" className="input" />
            <ErrorMessage name="image_url" component="div" className="error" />

            <label>Bio</label>
            <Field name="bio" as="textarea" className="input" />
            <ErrorMessage name="bio" component="div" className="error" />

            {errors.submit && <div className="error">{errors.submit}</div>}

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
