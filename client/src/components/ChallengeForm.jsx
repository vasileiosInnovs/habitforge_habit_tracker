import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/Buttons.css";

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
    start_date: Yup.string().required("Start date is required"),
    end_date: Yup.string()
        .nullable()
        .test('is-after-start', 'End date must be after start date', function (value) {
            const { start_date } = this.parent;
            return !value || new Date(value) >= new Date(start_date);
  }),

  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("Submitting challenge:", values);
    fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values)
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to create challenge");
        return r.json();
      })
      .then((newChallenge) => {
        onChallengeCreated(newChallenge);
        resetForm();
      })
      .catch((err) => {
        alert("Could not create challenge.");
        console.error(err);
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
        <Form className="form">
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
