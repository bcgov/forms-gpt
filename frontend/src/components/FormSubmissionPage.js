import React, { useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { Form } from '@formio/react'; // Assuming you're using Form.io React components
import { ToastContainer, Toast } from 'react-bootstrap';
const FormSubmissionPage = () => {
    const { formIndex } = useParams();
    const { forms } = useFormContext();
    const [submission, setSubmission] = useState({});
    const [showToast, setShowToast] = useState(false); // State to control the toast visibility
    const navigate = useNavigate();
    const form = forms[formIndex];

    const handleSubmit = async (submissionData) => {
        // You would handle the form submission here
        // This could include validating the data and then saving it to your database or server
        console.log(submissionData);
        setSubmission(submissionData);
        // Display success toast message
        // Show the toast
        setShowToast(true);

        // Optionally wait a few seconds, then navigate
        setTimeout(() => {
            console.log("Submission",submission);
            setShowToast(false); // Hide toast
            navigate('/'); // Navigate back to the list page
        }, 3000); // Adjust time as needed
    };

    if (!form) {
        return <div>Form not found!</div>;
    }

    return (
        <div className="form-submission-container m-3">
            <h2>Submit Form: {form.title}</h2>
            <Form form={form} onSubmit={handleSubmit} />
            <ToastContainer className="p-3" position={'top-end'}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Submission Status</strong>
                    </Toast.Header>
                    <Toast.Body>Form submitted successfully!</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default FormSubmissionPage;
