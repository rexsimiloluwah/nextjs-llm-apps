/* eslint-disable @next/next/no-img-element */
"use client";
import { Message } from "@/types/chat";
import { useRef, useState } from "react";
import { Document } from "langchain/document";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import SourceDocumentsAccordion from "@/components/SourceDocumentsAccordion";
import { ChainResponse } from "@/lib/chat";

export default function ChatWithKati() {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageState, setMessageState] = useState<{
    messages: (Message & { showSourceDocuments?: boolean })[];
    pending?: string;
    history: string[];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: "Hi, what would you like to ask Kati Frantz?",
        type: "aiMessage",
      },
    ],
    history: [],
  });
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { messages, history } = messageState;

  const handleQuery = async (question: string) => {
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
      const response = await fetch("/api/chat-with-kati", {
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
        history: [...prev.history, question, data.text],
      }));

      // Scroll to bottom
      messageListRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const question = query.trim();

    handleQuery(question);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && query) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const prompts = [
    "Enumerate how I can ace job interviews",
    "How can I get remote jobs?",
    "What is the primary skill for a software engineer?",
    "How can I improve as a junior developer?",
  ];

  return (
    <main className="w-full">
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
                    loading={loading && id === messageState.messages.length - 1}
                    aiIcon={
                      <div className="relative overflow-hidden w-12 h-12 rounded-full border-blue-600 border-2">
                        <img
                          src="/images/katifrantz.jpg"
                          className="object-cover"
                          alt="Kati"
                        />
                      </div>
                    }
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
                </div>
                {message.showSourceDocuments ? (
                  <SourceDocumentsAccordion
                    sourceDocuments={message.sourceDocs}
                  />
                ) : null}
              </>
            ))}
          </div>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} ref={formRef}>
            <ChatInput
              autoFocus={false}
              onKeyDown={handleEnter}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              loading={loading}
              className="hover:border-blue-500"
            />
          </form>
        </div>
      </div>
      <div className="flex gap-4 justify-center items-center max-w-5xl mx-auto flex-wrap my-3">
        {prompts.map((prompt, id) => (
          <button
            className="transition text-sm hover:scale-105 opacity-80 hover:opacity-100 bg-blue-50 border-[1px] backdrop-blur-sm shadow-sm border-blue-400 p-2 rounded-2xl"
            key={id}
            onClick={() => {
              handleQuery(prompt);
              window.scrollTo({
                top: 0,
                behavior: "smooth", // Use smooth scrolling effect
              });
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </main>
  );
}
