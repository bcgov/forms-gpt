import React, {useEffect, useState, useRef, useContext} from 'react';
import {postEditForm, postPrompt} from '../requests/PromptRequests';
import { Form as FormRender } from '@formio/react';
import { Modal, Button } from 'react-bootstrap';
import { MessageList, Input, Button as ChatButton } from "react-chat-elements";
/*import { compressJson } from '../helpers/compressJson';*/
import { KeycloakContext } from '../context/KeycloakContext';
import "react-chat-elements/dist/main.css";
import './GPTCreate.css'; // Ensure this is correctly pointing to your CSS file

const INIT_GPT_MESSAGE_CREATE = (
    <span>
        Hello, I'm Forms-GPT. I can help you build forms based on what you tell me.
        <span style={{ color: 'red' }}> I can make mistakes, and cannot replace your effort. Please check my work before publishing.</span>
        Please tell me what kind of form you would like to create! For example, you might say: "Create an employee satisfaction survey form"
    </span>
);

const INIT_GPT_MESSAGE_EDIT = (
    <span>
        Hello, I'm Forms-GPT. I can help you build or edit forms based on what you tell me.
        <span style={{ color: 'red' }}> I can make mistakes, and cannot replace your effort. Please check my work before publishing.</span>
        Please tell me what kind of changes you'd like to make! For example, you might say: "Create an employee satisfaction survey form" or
        "Add a new field for Shirt size with XS through XL as options"
    </span>
);
const GPTCreate = ({onApply, initialForm, onShowAssistant}) => {
    const { getToken } = useContext(KeycloakContext)

    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // Add a state to hold the current form being edited, initialized with the initial form if provided
    const [currentForm, setCurrentForm] = useState(initialForm);
    const [chat, setChat] = useState([]);
    const [showAssistant, setShowAssistant] = useState(false);

    const messageBoxRef = useRef(null)

    useEffect(() => {
        const gptMessage = initialForm ? INIT_GPT_MESSAGE_EDIT : INIT_GPT_MESSAGE_CREATE
        if (chat.length === 0) { // Only append the initial message if the chat is empty
            setChat([
                {
                    position: 'left',
                    type: 'text',
                    text: <p>{gptMessage}</p>,
                    date: new Date(),
                }
            ]);
        }
    }, [chat, initialForm]);

    useEffect(()=>{
        onShowAssistant(showAssistant);
    },[showAssistant, onShowAssistant])

    // // When handling the Apply action or any other action that should clear the prompt:
    // const handleActionThatClearsPrompt = () => {
    //     // Other logic...
    //     setPrompt(''); // Now clear the input field as part of a specific action.
    // };
    

    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        setLoading(true);

        // Append user's message to chat
        appendToChat({
            position: 'right',
            type: 'text',
            text: prompt,
            date: new Date(),
        });

        appendToChat({
            position: 'left',
            type: 'text',
            text: <div className="typing-indicator"><span></span><span></span><span></span></div>,
            date: new Date(),
            loading: true, // Mark this message as the loading indicator
        });
        messageBoxRef.current?.scrollIntoView({behaviour:'smooth'})
        try {
            /*// Determine which API to call based on whether we are updating an existing form
            if(currentForm){
                console.log(compressJson(currentForm))
            }*/

            const apiCall = currentForm ? postEditForm : postPrompt;
            const token = getToken();
            const payload = currentForm ? { prompt, form: currentForm, token} : { prompt, token};
            setPrompt("")
            const res = await apiCall(payload)
            setResponse(res);
            setCurrentForm(res);

            // Remove the loading message before appending the GPT reply
            appendandUpdateChat(prevChat => {
                // Remove the loading message in case of error
                const newChat = [...prevChat];
                const loadingMessageIndex = newChat.findIndex(message => message.loading);
                if (loadingMessageIndex !== -1) {
                    newChat.splice(loadingMessageIndex, 1);
                }
                return newChat;
            });
            appendToChat({
                position: 'left',
                type: 'text',
                text: <div>Here is your form! Click 'Preview' to see it again or type another prompt.<br/><Button onClick={handleReopenPreview} className="preview-again-btn">
                    Preview
                </Button></div>,
                date: new Date(),
            });
            appendToChat({
                position: 'left',
                type: 'text',
                text: "Need to adjust your form or have another request? Go ahead, I'm here to help!",
                date: new Date(),
            });

            setPrompt(''); // Clear the input after sending
            setLoading(false);
            setModalOpen(true); // Automatically open the modal to show the form preview
        } catch (error) {
            console.error("Error submitting prompt:", error);

            // Remove the loading message in case of error as well
            appendandUpdateChat(prevChat => {
                // Remove the loading message in case of error
                const newChat = [...prevChat];
                const loadingMessageIndex = newChat.findIndex(message => message.loading);
                if (loadingMessageIndex !== -1) {
                    newChat.splice(loadingMessageIndex, 1);
                }
                return newChat;
            });
            var errorMessage = error.response?.data?.error ? error.response?.data?.error : error.response?.data
            if(errorMessage==="Invalid JSON response format."){
                errorMessage = "Please alter your prompt. The prompt you wrote created an invalid form."
            }
            console.log(errorMessage)
            appendToChat({
                position: 'left',
                type: 'text',
                text: errorMessage,
                date: new Date(),
            });

            setLoading(false);
        }
    };

    const handleReopenPreview = () => setModalOpen(true);

    // Helper function to append messages to the chat
    const appendToChat = (message) => {
        setChat((prevChat) =>{
            return [...prevChat, message];
        })
    };
    const appendandUpdateChat = (updateFunction) => {
        setChat(updateFunction);
    };
    const handleModalClose = () => {
        setModalOpen(false);

        // Append a system message encouraging the user to ask more or use the form.
     /*   appendToChat({
            position: 'left',
            type: 'text',
            text: "Need to adjust your form or have another request? Go ahead, I'm here to help!",
            date: new Date(),
        });*/
    };

    const handleApply = () => {
        if (response) {
            onApply(response); // Use the response to update the form in the parent component
            setCurrentForm(response); // Update current form for any subsequent edit prompts
            appendToChat({
                position: 'left',
                type: 'text',
                text: "Your changes have been applied.",
                date: new Date(),
            });
            setModalOpen(false);
        }
        setShowAssistant(false);
    };
    const handleMinimise = ()=>{
        setShowAssistant(false);
    }


    return (
        <>
            {showAssistant &&
                <div className="gpt-create-container">
                    <div className='chat-container'>
                        <div className="chat-header">
                            <div className='header-button text-start'>
                                <strong>Forms-GPT</strong>
                            </div>
                            <i className="fa fa-minus minimize-button" onClick={handleMinimise}></i>
                        </div>
                        <MessageList
                            referance={messageBoxRef}
                            className='message-list'
                            lockable={true}
                            toBottomHeight={0}
                            dataSource={chat}
                        />
                        <Input
                            placeholder="Type your form prompt here..."
                            multiline={true}
                            clear={loading}
                            rightButtons={
                                <ChatButton
                                    disabled={loading}
                                    color='white'
                                    backgroundColor={loading ? 'grey' : 'green'}
                                    text={<i className="fa fa-paper-plane"></i>}
                                    loading={loading} // Adjust according to your component's props if needed
                                    onClick={handleSubmit}
                                >
                                </ChatButton>
                            }
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && !loading) {
                                    e.target.value = ""
                                    e.preventDefault();
                                    handleSubmit();
                                    
                                }
                            }}
                            value={prompt}
                        />
                        <Modal show={modalOpen} onHide={handleModalClose} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Form Preview</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {response && <FormRender form={response}/>}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleApply}>
                                    Apply
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>}
            <button
                onClick={() => {
                    setShowAssistant(!showAssistant)
                }}
                className={`toggle-assistant-btn ${showAssistant ? 'btn-hide' : 'btn-show'}`}
                aria-label="Toggle Assistant"
            >
                <i className={`fa ${showAssistant ? 'fa-times' : 'fa-comments'}`}></i>
            </button>
        </>
    );
};

export default GPTCreate;
