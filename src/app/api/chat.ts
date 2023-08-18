import { initPineconeClient } from "@/lib/pinecone";
import { PINECONE_INDEX_NAME } from "@/config/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { makeChain } from "@/utils/makeChain";
import { AIMessage, HumanMessage } from "langchain/schema";
import { Document } from "langchain/document";
import chatSchema from "../schemas/chatSchema";
import { z } from "zod";
import { NextResponse } from "next/server";

export type ChainResponse = {
  text: string;
  sourceDocuments: Document[];
};

export const chatHandler = async (
  req: Request,
  questionGeneratorPrompt?: string
) => {
  try {
    const body = await req.json();
    const data = chatSchema.parse(body);

    const { question, history } = data;

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

    return NextResponse.json(
      {
        status: true,
        data: response as ChainResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: false,
          error: error.issues[0].message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        status: false,
        error: error.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
};
