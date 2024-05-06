const axios = require('axios')

const tokenFromHeader = (req) =>{
    const [type,token] = req.headers.authorization?.split(" ") ?? [];
    return type==="Bearer" ? token : undefined;
}
const verifyKeycloakToken = async (token) =>{
    const validateUrl = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`

    try {
        const response = await axios.get(validateUrl,{
            headers: {
                "Content-Type": "application/json",
                "crossorigin": "true",
                "Authorization": `Bearer ${token}` // Include the token in the Authorization header
            },
        });
        return response;
    } catch (error) {
        console.error("An error occurred in verifyKeycloakToken:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
}
exports.tokenFromHeader = tokenFromHeader;
exports.verifyKeycloakToken = verifyKeycloakToken;