import { ChatOpenAI } from "langchain/chat_models/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";

export const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
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

const QA_TEMPLATE = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
Always say "Thanks for asking, You rock!" at the end of every answer.

{context}

Question: {question}

The output should strictly be in markdown format for lists, headings etc. 

Lists should be in the form:
- Item 1
- Item 2
- Item 3

Helpful answer in markdown:`;

export const makeChain = (
  vectorstore: PineconeStore,
  questionGeneratorPrompt?: string
) => {
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
        prompt: new PromptTemplate({
          inputVariables: ["context", "question"],
          template: QA_TEMPLATE,
        }),
      },
      memory: new BufferMemory({
        memoryKey: "chat_history",
        inputKey: "question",
        outputKey: "text",
        returnMessages: true,
      }),
      questionGeneratorChainOptions: {
        template:
          questionGeneratorPrompt || CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT,
      },
      returnSourceDocuments: true,
    }
  );

  return chain;
};
