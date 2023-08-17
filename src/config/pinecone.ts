if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error("`PINECONE_INDEX_NAME` environment variable not set.");
}

export const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
export const PINECONE_NAME_SPACE = "test";
