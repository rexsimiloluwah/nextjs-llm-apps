"use client";
import type { Metadata } from "next";
import { Message } from "@/types/chat";
import { useRef, useState } from "react";
import { Document } from "langchain/document";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { ChainResponse } from "@/pages/api/chat";
import ReactMarkdown from "react-markdown";
import SourceDocumentsAccordion from "@/components/SourceDocumentsAccordion";

export const metadata: Metadata = {
  title: "Chat with Docs",
  description: "Document Chat App using LangChain, OpenAI, and Pinecone",
};

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<{
    messages: (Message & { showSourceDocuments?: boolean })[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: "Hi, what would you like to learn about this course?",
        type: "aiMessage",
      },
    ],
    history: [],
  });
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const { messages, history } = messageState;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const question = query.trim();

    setMessageState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          type: "userMessage",
          message: question,
        },
      ],
    }));

    setLoading(true);
    setQuery("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          history,
        }),
      });

      const responseJson = await response.json();
      const data = responseJson.data as ChainResponse;

      setMessageState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            type: "aiMessage",
            message: data.text,
            sourceDocs: data.sourceDocuments,
          },
        ],
        history: [...prev.history, [question, data.text]],
      }));

      // Scroll to bottom
      messageListRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && query) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center my-8 w-[75vw] mx-auto gap-y-4">
      <div className="w-full h-[65vh] rounded-lg flex justify-center items-center border-[1px] shadow-md backdrop-blur-sm border-slate-300">
        <div className="w-full h-full overflow-y-scroll">
          {messages.map((message, id) => (
            <>
              <div className="relative">
                <ChatMessage
                  key={id}
                  message={message.message}
                  type={message.type}
                />
                {message.type === "aiMessage" && id > 0 && (
                  <button
                    className="text-xs absolute bottom-2 right-2"
                    onClick={() =>
                      setMessageState((prev) => {
                        prev.messages[id].showSourceDocuments =
                          !prev.messages[id].showSourceDocuments;
                        return {
                          ...prev,
                          messages: prev.messages,
                        };
                      })
                    }
                  >
                    Show Source Documents
                  </button>
                )}

                {message.showSourceDocuments ? (
                  <SourceDocumentsAccordion
                    sourceDocuments={message.sourceDocs}
                  />
                ) : null}
              </div>
            </>
          ))}
        </div>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <ChatInput
            autoFocus={false}
            onKeyDown={handleEnter}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
}
