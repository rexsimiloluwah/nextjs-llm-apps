import yargs from "yargs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import {
  DirectoryLoader,
  LoadersMapping,
} from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { initPineconeClient } from "@/lib/pinecone";
import { PINECONE_INDEX_NAME } from "@/config/pinecone";

function getFileExtension(fileName: string): string | null {
  const lastDotIndex = fileName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return null;
  }

  const extension = fileName.slice(lastDotIndex + 1);
  return extension.toLowerCase();
}

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
  .option("extension", {
    describe: "The file extension",
    type: "string",
    choices: [".txt", ".pdf"],
  })
  .help().argv;

async function run() {
  const args = argv as {
    type: "file" | "directory";
    path: string;
    extension: ".txt" | ".pdf";
  };

  if (!args.path || !args.type || !args.extension) {
    console.log(
      "`path` or `type` or `extension` variable not set in command line args."
    );
    return;
  }

  if (!["file", "directory"].includes(args.type)) {
    console.log("`path` must be one of 'file' or 'directory'");
    return;
  }

  if (![".txt", ".pdf"].includes(args.extension)) {
    console.log("`extension` must be one of `.txt` or `.pdf`");
    return;
  }

  try {
    let loader;

    if (args.type === "file") {
      if (args.extension === ".txt") {
        loader = new TextLoader(args.path);
      } else if (args.extension === ".pdf") {
        loader = new PDFLoader(args.path);
      }
    } else if (args.type === "directory") {
      loader = new DirectoryLoader(args.path, {
        ".pdf": (path) => new PDFLoader(path),
        ".txt": (path) => new TextLoader(path),
      });
    }

    if (!loader) {
      console.log("Invalid loader configuration");
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
