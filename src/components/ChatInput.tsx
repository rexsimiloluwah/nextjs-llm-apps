import React from "react";
import { SendHorizontalIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import LoadingDots from "./LoadingDots";

interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  loading?: boolean;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, loading, ...props }, ref) => {
    return (
      <div className="relative w-full border-[1px] border-slate-300 shadow-sm backdrop-blur-sm rounded-lg overflow-hidden">
        <textarea
          className="w-full px-8 py-4 resize-none outline-none"
          placeholder="Enter your message"
          rows={1}
          maxLength={512}
          aria-labelledby="Chat Input"
          ref={ref}
          disabled={loading}
          {...props}
        />
        <button
          type="submit"
          disabled={loading}
          className={twMerge(
            "absolute top-5 right-4",
            !props.value && "text-neutral-300"
          )}
        >
          {loading ? (
            <LoadingDots className="mt-2" />
          ) : (
            <SendHorizontalIcon size={24} />
          )}
        </button>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
