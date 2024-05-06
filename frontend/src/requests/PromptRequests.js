import {
    httpPOSTRequestWithoutToken
} from "./httpRequestHandler";
import API from "./endpoints";

export async function postPrompt({prompt, token}){


    try{
        const response = await httpPOSTRequestWithoutToken(API.POST_PROMPT, prompt);
        return response.data;
    }catch (error) {
        console.error("an error occurred in postPrompt",error);
        throw error;
    }
}

export async function postEditForm({prompt,form}){
    try{
        const response = await httpPOSTRequestWithoutToken(API.POST_EDIT_FORM, {
            prompt:prompt,
            form:JSON.stringify(form)
        },
        )
        return response.data
    }catch (error){
        console.error("an error occurred in postEditForm",error)
        throw error;
    }
}