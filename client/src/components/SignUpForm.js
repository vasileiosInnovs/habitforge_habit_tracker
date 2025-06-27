import React, {useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function SignupForm({ onSignup }) {
    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Required"),
        image_url: Yup.string().url("Must be a valid URL"),
        bio: Yup.string().max(50, "Bio too long")
    });

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
            <Formik 
                initialValues={{ username: '', email: '', password: '', image_url: '', bio: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  fetch("/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      setSubmitting(false);
                      onSignup(data);
                    });
                }}
                >
                <From className="space-y-4">
                    <label>Username</label>
                    <Field name="username" className="input" />
                    <ErrorMessage name="username" components="div" className="text-red-500 text-sm" />

                    <label>Email</label>
                    <Field name="email" className="input" />
                    <ErrorMessage name="email" components="div" className="text-red-500 text-sm" />

                    <label>Password</label>
                    <Field name="password" className="input" />
                    <ErrorMessage name="password" components="div" className="text-red-500 text-sm" />

                    <label>Username</label>
                    <Field name="username" className="input" />
                    <ErrorMessage name="username" components="div" className="text-red-500 text-sm" />

                    <label>Image URL</label>
                    <Field name="image_url" className="input" />
                    <ErrorMessage name="image_url" components="div" className="text-red-500 text-sm" />

                    <label>Bio</label>
                    <Field name="bio" className="input" as="textarea" />
                    <ErrorMessage name="bio" component="div" className="text-red-500 text-sm"/>
                </From>
            </Formik>
        </div>
        
    );
}

export default SignupForm;