import axios from "axios";

// const qs = require("querystring");

export const httpPOSTRequestWithoutToken = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
                "crossorigin" : "true"
            },
        });
        return response;
    } catch (error) {
        console.error("An error occurred in httpPOSTRequestWithoutToken:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

export const httpPOSTRequestWithToken = async (url, data, token) => {
    try {
        const response = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
                "crossorigin": "true",
                "Authorization": `Bearer ${token}` // Include the token in the Authorization header
            },
        });
        return response;
    } catch (error) {
        console.error("An error occurred in httpPOSTRequestWithToken:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};


export const httpGETRequestWithoutToken = async (url, data) => {
    try {
        const response = await axios.get(url, {
            params: data
        });
        return response;
    } catch (error) {
        console.error("An error occurred in httpGETRequestWithoutToken:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};

export const httpPUTRequestWithoutToken = async (url, data) => {
    try {
        const response = await axios.put(url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
        console.error("An error occurred in httpPUTRequestWithoutToken:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
};






// export const httpGETRequest = (
//     url,
//     data,
//     token,
//     isBearer = true,
//     headers = null
// ) => {
//     return axios.get(url, {
//         params: data,
//         headers: !headers
//             ? {
//                 Authorization: isBearer
//                     ? `Bearer ${token}`
//                     : token,
//             }
//             : headers,
//     });
// };

// export const httpGETBlobRequest = (
//     url,
//     data,
//     token,
//     isBearer = true,
//     headers = null
// ) => {
//     return axios.get(url, {
//         params: data,
//         responseType: "blob",
//         headers: !headers
//             ? {
//                 Authorization: isBearer
//                     ? `Bearer ${token || UserService.getToken()}`
//                     : token,
//             }
//             : headers,
//     });
// };

// export const httpPOSTRequest = (
//     url,
//     data,
//     token,
//     isBearer = true,
//     headers = null
// ) => {
//     return axios.post(url, data, {
//         headers: !headers
//             ? {
//                 Authorization: isBearer
//                     ? `Bearer ${token || UserService.getToken()}`
//                     : token,
//             }
//             : headers,
//     });
// };

// export const httpPOSTBlobRequest = (
//     url,
//     params,
//     data,
//     token,
//     isBearer = true,
//     headers = null
// ) => {
//     return axios.post(url, data, {
//         params: params,
//         responseType: "blob",
//         headers: !headers
//             ? {
//                 Authorization: isBearer
//                     ? `Bearer ${token || UserService.getToken()}`
//                     : token,
//             }
//             : headers,
//     });
// };



// export const httpPUTRequest = (url, data, token, isBearer = true) => {
//     return axios.put(url, data, {
//         headers: {
//             Authorization: isBearer
//                 ? `Bearer ${token}`
//                 : token,
//         },
//     });
// };

// export const httpDELETERequest = (url, token, isBearer = true) => {
//     return axios.delete(url, {
//         headers: {
//             Authorization: isBearer
//                 ? `Bearer ${token || UserService.getToken()}`
//                 : token,
//         },
//     });
// };