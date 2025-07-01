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

function ChallengeForm({
  onChallengeCreated = () => {},
  challengeToEdit = null,
  onUpdateChallenge = () => {},
}) {
  const isEdit = !!challengeToEdit;

  const initialValues = {
    title: challengeToEdit?.title || '',
    description: challengeToEdit?.description || '',
    start_date: challengeToEdit?.start_date?.slice(0, 10) || '',
    end_date: challengeToEdit?.end_date?.slice(0, 10) || ''
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const challengeData = {
      title: values.title,
      description: values.description,
      start_date: values.start_date,
      end_date: values.end_date || null
    };

    const url = isEdit
      ? `${process.env.REACT_APP_API_URL}/challenges/${challengeToEdit.id}`
      : `${process.env.REACT_APP_API_URL}/challenges`;

    const method = isEdit ? "PATCH" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(challengeData)
    })
      .then((r) => {
        if (!r.ok) {
          return r.json().then(errorData => {
            throw new Error(`Failed to ${isEdit ? "update" : "create"} challenge: ${JSON.stringify(errorData)}`);
          });
        }
        return r.json();
      })
      .then((resultChallenge) => {
        if (isEdit) {
          onUpdateChallenge(resultChallenge);
        } else {
          onChallengeCreated(resultChallenge);
          resetForm();
        }
      })
      .catch((err) => {
        console.error(err);
        alert(`Could not ${isEdit ? "update" : "create"} challenge. Check console for details.`);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Formik
      enableReinitialize
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
            {isEdit ? "Update Challenge" : "Add Challenge"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default ChallengeForm;
