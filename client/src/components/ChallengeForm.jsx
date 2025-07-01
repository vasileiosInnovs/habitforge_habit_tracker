import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../index.css';

const ChallengeSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date()
    .min(Yup.ref('start_date'), "End date must be after start date")
    .nullable()
});

function ChallengeForm({ onChallengeCreated = () => {} }) {
  const initialValues = {
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("Raw form values:", values);
    console.log("Start date value:", values.start_date);
    console.log("Start date type:", typeof values.start_date);
    console.log("End date value:", values.end_date);
    console.log("End date type:", typeof values.end_date);

    const challengeData = {
      title: values.title,
      description: values.description,
      start_date: values.start_date,
      end_date: values.end_date || null 
    };

    console.log("Processed challenge data:", challengeData);
    console.log("JSON stringified data:", JSON.stringify(challengeData));

    fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(challengeData)
    })
      .then((r) => {
        console.log("Response status:", r.status);
        console.log("Response ok:", r.ok);
        if (!r.ok) {
          return r.json().then(errorData => {
            console.log("Error response data:", errorData);
            throw new Error(`Failed to create challenge: ${JSON.stringify(errorData)}`);
          });
        }
        return r.json();
      })
      .then((newChallenge) => {
        console.log("Challenge created successfully:", newChallenge);
        onChallengeCreated(newChallenge);
        resetForm();
      })
      .catch((err) => {
        console.error("Full error object:", err);
        alert("Could not create challenge. Check console for details.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ChallengeSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="challenge-form">
          <Field name="title" placeholder="Challenge Title" className="input" />
          <ErrorMessage name="title" component="div" className="error-message" />

          <Field
            name="description"
            as="textarea"
            placeholder="Description"
            className="input"
          />
          <ErrorMessage name="description" component="div" className="error-message" />

          <Field name="start_date" type="date" className="input" />
          <ErrorMessage name="start_date" component="div" className="error-message" />

          <Field name="end_date" type="date" className="input" />
          <ErrorMessage name="end_date" component="div" className="error-message" />

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            Add Challenge
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default ChallengeForm;