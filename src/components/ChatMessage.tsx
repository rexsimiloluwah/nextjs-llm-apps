import React from "react";
import { BotIcon, UserCircleIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { twMerge } from "tailwind-merge";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: string;
  type: "aiMessage" | "userMessage";
  loading?: boolean;
  aiIcon?: React.ReactNode;
  userIcon?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  type,
  loading,
  aiIcon,
  userIcon,
}) => {
  const uIcon = userIcon ? userIcon : <UserCircleIcon size={48} />;
  const aIcon = aiIcon ? aiIcon : <BotIcon size={32} />;

  return (
    <div
      className={twMerge(
        "flex gap-x-4 p-4 items-start",
        type === "aiMessage" ? "bg-blue-50" : "bg-neutral-50",
        type === "userMessage" && loading && "usermessagewaiting"
      )}
    >
      <div>{type === "aiMessage" ? aIcon : uIcon}</div>
      <div>
        <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
};

ChatMessage.defaultProps = {
  loading: false,
};

export default ChatMessage;
