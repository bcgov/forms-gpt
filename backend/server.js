const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const { ChatOpenAI } = require("@langchain/openai");
const {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate
} = require("@langchain/core/prompts");

const { formatDocumentsAsString } = require("langchain/util/document");
const { RunnableSequence, RunnablePassthrough } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const {rateLimit} = require('express-rate-limit')
const { jwtDecode } = require('jwt-decode')

const { processDirectory } = require('./context/index.js')
const { verifyKeycloakToken, tokenFromHeader } = require('./auth/index')


dotenv.config();
const app = express();

app.use(express.json());

// Use CORS middleware - adjust according to your needs
app.use(cors());



app.get('/health', (req, res) => {
    console.log(`Health check called`);
    res.status(200).send('OK');
});

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const rateLimitWindow = DAY_IN_MILLISECONDS;
//Limits 150 requests per day per user by default
const limit = process.env.API_DAILY_LIMIT ? process.env.API_DAILY_LIMIT : 150;
const limiter = rateLimit({

    keyGenerator: function(req){
        const token = req.headers['authorization']
        if(token){
            var decoded = jwtDecode(token)
            return decoded.idir_user_guid//limit requests by idir users
        }
        console.log("ip used"+ limit)
        return req.ip
    },
    windowMs: rateLimitWindow,
    limit: limit,
    message: `You have exceeded the request limit. ${limit} Requests per 24 Hours.`,
    standardHeaders: true    
})
app.use(limiter)


app.use((req,res,next)=>{
    const token = tokenFromHeader(req);
    if (!token){
        return res.status(401)
    }
    verifyKeycloakToken(token).then(()=>{
        console.log("Valid token")
        next();
    })
    .catch((err)=>{
        res.status(400).json(err)
    })
})

const SYSTEM_MESSAGE = `you are an assistant to help create form.io forms with full and completed json files. You can add form fields which you believe would be relevant. The components you can use are:   textfield, textarea, number, checkbox, radio, select, datetime, file,day,time, url, email, phoneNumber, currency, hidden, password, panel, well, button, columns, fieldset, htmlelement, content, html, alert, tabs`;
const EDIT_SYSTEM_MESSAGE = `you are an assistant to help create form.io forms with full and completed json files. You will be provided with a Form.io JSON to alter, and a prompt which contains your instructions for alteration. Interpret the instructions and use Form.io components to achieve the desired result and return the JSON file \n{form}`
const DOCS_PATH = "./docs/";

const chatModel = new ChatOpenAI({
    temperature: 1,
    openAIApiKey: process.env.OPENAI_API_KEY
});

// Use a self-invoking function to set the retriever due to its async nature
let vectorStoreRetriever;
(async () => {
    vectorStoreRetriever = await processDirectory(DOCS_PATH);
})();

function removeEllipses(string){
    return string.replace("...","");
}

function formJsonFromResponse(response) {
    const start = response.indexOf("{");
    const end = response.lastIndexOf("}") + 1; // To include the last parenthesis
    var form = response.slice(start, end)
    if(form.indexOf("...")){
        form = removeEllipses(form);
    }
    try {
        return JSON.parse(form);
    } catch (error) {
        console.error("JSON parsing error: ", error);
        throw new Error("Invalid JSON response format.");
    }
}



app.post('/prompt', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const question = req.body.prompt;
    try {
        if (!vectorStoreRetriever) {
            throw new Error("Vector store retriever is not ready.");
        }
        const context = await vectorStoreRetriever.pipe(formatDocumentsAsString);
        const chain = RunnableSequence.from([
            {
                context: context,
                question: new RunnablePassthrough()
            },
            ChatPromptTemplate.fromMessages([
                SystemMessagePromptTemplate.fromTemplate(SYSTEM_MESSAGE),
                HumanMessagePromptTemplate.fromTemplate("{question}")
            ]),
            chatModel,
            new StringOutputParser(),
        ]);
        const answer = await chain.invoke(question);
        res.json(formJsonFromResponse(answer));
    } catch (error) {
        console.error("Prompt processing error: ", error);
        res.status(500).json( error || "Internal Server Error" );
    }
});
//Requires form to be formatted as a string
app.post('/edit', async (req, res) => {
    console.log("/edit")
    res.header("Access-Control-Allow-Origin", "*");
    const question = req.body.prompt;
    const form = req.body.form;
    try {
        if (!vectorStoreRetriever) {
            throw new Error("Vector store retriever is not ready.");
        }
        const context = await vectorStoreRetriever.pipe(formatDocumentsAsString);
        const chain = RunnableSequence.from([
            {
                context: context,
                question: new RunnablePassthrough(),
                form: new RunnablePassthrough()
            },
            ChatPromptTemplate.fromMessages([
                SystemMessagePromptTemplate.fromTemplate(EDIT_SYSTEM_MESSAGE),
                HumanMessagePromptTemplate.fromTemplate(question)
            ]),
            chatModel,
            new StringOutputParser(),
        ]);
        const answer = await chain.invoke(
            form
        );
        res.json(formJsonFromResponse(answer));
    } catch (error) {
        console.error("Prompt processing error: ", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }

})

app.post('/auth', async (req,res)=>{
    const token = req.headers['authorization']
    var decoded = jwtDecode(token)
    console.log(decoded.idir_user_guid)
    res.json(decoded.idir_user_guid)
})

const port = process.env.PORT || 3081;
app.listen(port,'0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});
