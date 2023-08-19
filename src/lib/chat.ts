import { NextApiRequest, NextApiResponse } from "next";
import { initPineconeClient } from "@/lib/pinecone";
import { PINECONE_INDEX_NAME } from "@/config/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { makeChain } from "@/utils/makeChain";
import { AIMessage, HumanMessage } from "langchain/schema";
import { Document } from "langchain/document";
import chatSchema from "@/schemas/chatSchema";
import { z } from "zod";

export type ChainResponse = {
  text: string;
  sourceDocuments: Document[];
};

export const chatHandler = (questionGeneratorPrompt?: string) => {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse<{
      status: boolean;
      message?: string;
      error?: string;
      data?: ChainResponse;
    }>
  ) {
    try {
      const data = chatSchema.parse(req.body);

      const { question, history } = data;

      console.log(question, history);

      const sanitizedQuestion = question.trim().replaceAll("\n", "");
      const pineconeClient = await initPineconeClient();
      const index = pineconeClient.Index(PINECONE_INDEX_NAME);

      // Create the vector store
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
          pineconeIndex: index,
          textKey: "text",
        }
      );

      // Create chain
      const chain = makeChain(vectorStore, questionGeneratorPrompt);

      const chatHistory = history.map((message: string, i: number) => {
        if (i % 2 === 0) {
          return new HumanMessage(message);
        } else {
          return new AIMessage(message);
        }
      });

      // Ask a question
      const response = await chain.call({
        question: sanitizedQuestion,
        chat_history: chatHistory,
      });

      // console.log(response);

      res.status(200).json({
        status: true,
        data: response as ChainResponse,
      });
    } catch (error: any) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ status: false, error: error.issues[0].message });
      }
      res.status(500).json({
        status: false,
        error: error.message || "Something went wrong.",
      });
    }
  };
};
