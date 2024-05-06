const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { JSONLoader } = require("langchain/document_loaders/fs/json");
const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { OpenAIEmbeddings } = require("@langchain/openai");

//Recursively loads documents for creating the contents from a directory, selecting specific loaders per file type
async function loadDocs(path) {
    try {
        const loader = new DirectoryLoader(path, {
            ".md": (p) => new TextLoader(p),
            ".txt": (p) => new TextLoader(p),
            ".json": (p) => new JSONLoader(p)
        }, true, "warn");
        return await loader.load();
    } catch (error) {
        console.error("Document Loading error: ", error);
        throw error; // Rethrow to handle it in the calling function
    }
}

async function splitDocs(docs) {
    try {
        //splits each document into 150 character long strings with 10 character overlap to allow for more relevant context to be added
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 150, chunkOverlap: 10 });
        return await splitter.splitDocuments(docs);
    } catch (error) {
        console.error("Splitting error: ", error);
        throw error;
    }
}

async function vectorStoreFromDocs(docs) {
    try {
        //Creates a Hierarchical Navigable Small World graph which allows for highly performant search and navigation to adjacent nodes
        //In our case, this allows for finding and returning relevant text snippets and their neighbours in a timely manner
        //for further information see "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs" by Yu. A. Malkov, D. A. Yashunin.
        return await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    } catch (error) {
        console.error("Vector store creation error: ", error);
        throw error;
    }
}


const processDirectory = async (path) => {
    try {
        const docs = await loadDocs(path);
        const split = await splitDocs(docs);
        const store = await vectorStoreFromDocs(split);
        return store.asRetriever();
    } catch (error) {
        console.error("Error processing directory: ", error);
        throw error;
    }
}

exports.processDirectory = processDirectory;