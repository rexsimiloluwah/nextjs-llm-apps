import { PineconeClient } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error(
    "`PINECONE_ENVIRONMENT` or `PINECONE_API_KEY` environment variables missing."
  );
}

export const initPineconeClient = async () => {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT as string,
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    return pinecone;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to initialize Pinecone client");
  }
};
