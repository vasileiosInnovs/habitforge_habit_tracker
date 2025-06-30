import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignupForm({ onSignup }) {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    image_url: Yup.string().url("Must be a valid URL"),
    bio: Yup.string().max(50, "Bio must be at most 50 characters"),
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
          fetch(`${process.env.REACT_APP_API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(values),
          })
            .then(async (res) => {
              if (!res.ok) {
                let message = "Signup failed";
                try {
                  const errorData = await res.json();
                  message = errorData.error || message;
                } catch (_) {
                  // Non-JSON or empty response
                }
                throw new Error(message);
              }
              return res.json();
            })
            .then((user) => {
              console.log("Signed up user:", user);
              onSignup(user);
              toast.success("Signup successful!");
              navigate(`/myday`);
              resetForm();
            })
            .catch((err) => {
              console.error("Signup error:", err);
              toast.error(err.message || "Signup failed.");
              setErrors({ submit: err.message });
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <label>Username</label>
            <Field name="username" className="input" autoFocus required />
            <ErrorMessage name="username" component="div" />

            <label>Email</label>
            <Field name="email" className="input" required />
            <ErrorMessage name="email" component="div" />

            <label>Password</label>
            <Field name="password" type="password" className="input" required />
            <ErrorMessage name="password" component="div" />

            <label>Image URL</label>
            <Field name="image_url" className="input" />
            <ErrorMessage name="image_url" component="div" />

            <label>Bio</label>
            <Field name="bio" as="textarea" className="input" maxLength="50" />
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
