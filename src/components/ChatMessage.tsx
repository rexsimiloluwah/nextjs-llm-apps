import React from "react";
import { BotIcon, UserCircleIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { twMerge } from "tailwind-merge";

interface ChatMessageProps {
  message: string;
  type: "aiMessage" | "userMessage";
  loading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  type,
  loading,
}) => {
  return (
    <div
      className={twMerge(
        "flex gap-x-4 p-4 items-center",
        type === "aiMessage" ? "bg-neutral-200" : ""
      )}
    >
      <div>
        {type === "aiMessage" ? (
          <BotIcon size={32} />
        ) : (
          <UserCircleIcon size={32} />
        )}
      </div>
      <div>
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
};

ChatMessage.defaultProps = {
  loading: false,
};

export default ChatMessage;
