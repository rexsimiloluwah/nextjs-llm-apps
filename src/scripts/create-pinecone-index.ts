import { initPineconeClient } from "@/lib/pinecone";
import { PINECONE_INDEX_NAME } from "@/config/pinecone";

(async () => {
  try {
    const pinecone = await initPineconeClient();

    const createRequest = {
      name: PINECONE_INDEX_NAME,
      dimension: 1536, // for OpenAI embeddings
      metric: "cosine",
    };

    await pinecone.createIndex({ createRequest });

    console.log(
      `✅ Successfully created pinecone index '${PINECONE_INDEX_NAME}'`
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create pinecone index");
  }
})();
