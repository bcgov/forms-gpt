import React, { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    console.log("form provider");
    const [forms, setForms] = useState(() => {
        const savedForms = localStorage.getItem('forms');
        return savedForms ? JSON.parse(savedForms) : [];
    });

    useEffect(() => {
        localStorage.setItem('forms', JSON.stringify(forms));
    }, [forms]);

    const saveForm = (form) => {
        setForms((prevForms) => [...prevForms, form]);
    };
    const deleteForm = (index) => {
        // Update your forms state by filtering out the form at the given index
        setForms(forms => forms.filter((_, formIndex) => formIndex !== index));
        // You might also want to update localStorage or make an API call here
    };
    const updateForm = (index, updatedForm) => {
        const newForms = [...forms];
        newForms[index] = updatedForm;
        setForms(newForms);
    };

    return (
        <FormContext.Provider value={{ forms, saveForm, updateForm, deleteForm }}>
            {children}
        </FormContext.Provider>
    );
};