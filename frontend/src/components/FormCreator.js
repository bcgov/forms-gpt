import React, { useState } from 'react';
import { FormBuilder } from '@formio/react';
import { useFormContext } from '../context/FormContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './FormCreator.css';
import GPTCreate from "./GPTCreate"; // Import custom CSS

const FormCreator = () => {
    const { saveForm } = useFormContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [showAssistant, setShowAssistant] = useState(false);

    // Initialize state based on passed state or default to new form
    const initialState = location.state?.formData || { display: 'form' };
    const [formName, setFormName] = useState(location.state?.formData?.title || '');
    const [formDescription, setFormDescription] = useState(location.state?.formData?.description || '');
    const [tempSchema, setTempSchema] = useState(initialState);

    const handleSave = () => {
        const formData = {
            ...tempSchema,
            title: formName,
            description: formDescription,
        };
        saveForm(formData);
        navigate("/");
    };

    const handleGPTApply = (formData) => {
        setTempSchema({...tempSchema,...formData}); // Set the form data into your state
    };

    const handleShowAssistant = (isAssistantVisible) => {
        setShowAssistant(isAssistantVisible);
    };

    return (
        <div className="form-creator-container">
            <div className={`main-content ${showAssistant ? 'blur-background' : ''}`}>
                <h2>Create a New Form</h2>
                <div className="form-creator-header">
                    <div className="form-metadata">
                        <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Form Name"
                            className="form-control my-2"
                        />
                        <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="Form Description (Optional)"
                            className="form-control my-2"
                        />
                    </div>
                    <button onClick={handleSave} className="btn btn-success save-form-btn">Save Form</button>
                </div>
                <FormBuilder form={tempSchema} onChange={(schema) => setTempSchema(schema)}/>
            </div>
            <GPTCreate onApply={handleGPTApply} initialForm={tempSchema} onShowAssistant={handleShowAssistant}/>
        </div>
    );
};

export default FormCreator;