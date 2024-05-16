import React from 'react';
import { Link } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { Toast } from 'react-bootstrap';
import "./FormList.css";
const FormList = () => {
    const { forms, deleteForm } = useFormContext(); // Assume deleteForm is now part of your context


    const handleDelete = (index) => {
        deleteForm(index);
        // Optionally, add a confirmation before deleting
    };

    const handleDownload = (form, index) => {
        const date = new Date();
        const timestamp = date.toISOString().substring(0, 19).replace(/:/g, '-');
        const formName = form.title || `Form-${index + 1}`;
        const fileName = `${formName}-${timestamp}.json`;

        const jsonData = JSON.stringify(form, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Toast className='mb-4'  style={{ width: "100%" }} bg='danger'>
                <Toast.Header closeButton={false}>
                Welcome to FormsGPT. Please export any forms you would like to save, saved forms will be deleted if your browser storage is reset.
                </Toast.Header>
            </Toast>
            <div className="m-3">
                <h2>Saved Forms</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Form Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {forms.map((form, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{form.title || `Form ${index + 1}`}</td>
                                <td>
                                    <Link to={`/form/${index}`} className="btn btn-primary me-2">
                                        <i className="fa fa-edit"></i> View/Update
                                    </Link>
                                    <Link to={`/form/submit/${index}`} className="btn btn-primary me-2">
                                        <i className="fa fa-paper-plane"></i> Submit
                                    </Link>
                                    <button onClick={() => handleDelete(index)} className="btn btn-danger action-button">
                                        <i className="fa fa-trash"></i> Delete
                                    </button>
                                    <button onClick={() => handleDownload(form, index)} className="btn btn-success action-button">
                                        <i className="fa fa-download"></i> Export Form
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>

    );
};

export default FormList;
