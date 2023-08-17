import { ChatOpenAI } from "langchain/chat_models/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { BufferMemory } from "langchain/memory";

const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaChainOptions: {
        type: "stuff",
      },
      memory: new BufferMemory({
        memoryKey: "chat_history",
        inputKey: "question",
        outputKey: "text",
        returnMessages: true,
      }),
      questionGeneratorChainOptions: {
        template: CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT,
      },
      returnSourceDocuments: true,
    }
  );

  return chain;
};
