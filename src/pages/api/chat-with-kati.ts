import withMethods from "@/utils/api-middlewares/with-methods";
import { chatHandler } from "../../lib/chat";

export type ChainResponse = {
  text: string;
  sourceDocuments: Document[];
};

const QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
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

const handler = chatHandler(QUESTION_GENERATOR_CHAIN_PROMPT);

export default withMethods(["POST"], handler);
