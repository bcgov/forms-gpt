import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { FormBuilder } from '@formio/react';
import "./FormViewUpdate.css";
import GPTCreate from "./GPTCreate";

const FormViewUpdate = () => {
    const { formIndex } = useParams();
    const navigate = useNavigate(); // Use navigate for redirection
    const { forms, updateForm } = useFormContext();
    const form = forms[formIndex];

    // State to hold the temporary schema
    const [tempSchema, setTempSchema] = useState(form);
    const [showAssistant, setShowAssistant] = useState(false);

    useEffect(() => {
        if (forms[formIndex]) {
            setTempSchema(forms[formIndex]);
        }
    }, [formIndex, forms]);

    const onSave = () => {
        updateForm(formIndex, tempSchema);
        navigate("/"); // Navigate to home page after save
    };

    const handleGPTApply = (formData) => {
        setTempSchema({...tempSchema,...formData}); // Set the form data into your state
    };
    const handleShowAssistant = (isAssistantVisible) => {
        setShowAssistant(isAssistantVisible);
    };

    return (
        <div className="m-3">
            <div className={`main-content ${showAssistant ? 'blur-background' : ''}`}>
              <div className="form-edit-header d-flex justify-content-between align-items-center">
                <h2>Edit Form: {form.title}</h2>
                <button onClick={onSave} className="btn btn-primary">Save Changes</button>
              </div>
              <FormBuilder form={tempSchema} onChange={(schema) => setTempSchema(schema)} />
            </div>
            <GPTCreate onApply={handleGPTApply} initialForm={tempSchema} onShowAssistant={handleShowAssistant}/>
        </div>
    );
};

export default FormViewUpdate;
