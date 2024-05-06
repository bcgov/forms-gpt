import {
    httpPOSTRequestWithToken
} from "./httpRequestHandler";
import API from "./endpoints";

export async function postPrompt({prompt, token}){


    try{
        const response = await httpPOSTRequestWithToken(API.POST_PROMPT, prompt, token);
        return response.data;
    }catch (error) {
        console.error("an error occurred in postPrompt",error);
        throw error;
    }
}

export async function postEditForm({prompt,form, token}){
    try{
        const response = await httpPOSTRequestWithToken(API.POST_EDIT_FORM, {
            prompt:prompt,
            form:JSON.stringify(form)
        },
        token)
        return response.data
    }catch (error){
        console.error("an error occurred in postEditForm",error)
        throw error;
    }
}