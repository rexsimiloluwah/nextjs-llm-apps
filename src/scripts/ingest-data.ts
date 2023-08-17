import yargs from "yargs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { initPineconeClient } from "@/lib/pinecone";
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from "@/config/pinecone";

const argv = yargs(process.argv.slice(2))
  .option("type", {
    describe: "Loader Type",
    type: "string",
    choices: ["file", "directory"],
    default: "directory",
  })
  .option("path", {
    describe: "File or Directory Path",
    type: "string",
  })
  .help().argv;

async function run() {
  const args = argv as { type: "file" | "directory"; path: string };

  if (!args.path || !args.type) {
    console.log("`path` or `type` variable not set in command line args.");
    return;
  }

  try {
    let loader;

    if (args.type === "file") {
      loader = new PDFLoader(args.path);
    } else if (args.type === "directory") {
      loader = new DirectoryLoader(args.path, {
        ".pdf": (path) => new PDFLoader(path),
      });
    }

    if (!loader) {
      console.log("Invalid configuration");
      return;
    }

    // Get the raw documents
    console.log("Loading the docs...");
    const rawDocs = await loader.load();

    // Split the text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 150,
    });

    console.log("Splitting the docs...");
    const docs = await textSplitter.splitDocuments(rawDocs);

    // Create and store the embeddings in the vector store
    const embeddings = new OpenAIEmbeddings();
    const pineconeClient = await initPineconeClient();
    const index = pineconeClient.Index(PINECONE_INDEX_NAME);

    console.log("Creating and storing embeddings in Pinecone...");
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to ingest data");
  }
}

(async () => {
  const success = await run();

  if (success) {
    console.log("✅ Ingestion complete");
  }
})();
