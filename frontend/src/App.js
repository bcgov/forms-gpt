import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FormCreator from './components/FormCreator';
import FormList from './components/FormList';
import { FormProvider } from './context/FormContext';
import NavbarComponent from "./components/NavbarComponent";
import FormViewUpdate from './components/FormViewUpdate';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import FormSubmissionPage from "./components/FormSubmissionPage";


function App() {
    return (
                <FormProvider>
                    <NavbarComponent/>
                    <Routes>
                        <Route path="/" element={<FormList />} />
                        <Route path="/create" element={<FormCreator />} />
                        <Route path="/form/:formIndex" element={<FormViewUpdate />} />
                        <Route path="/form/submit/:formIndex" element={<FormSubmissionPage />} />
                    </Routes>
                </FormProvider>
    );
}

export default App;
