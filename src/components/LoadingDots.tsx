import React from "react";
import { twMerge } from "tailwind-merge";

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ className }) => {
  return (
    <div className={twMerge("loader flex gap-x-1", className)}>
      <div className="w-2 h-2 bg-neutral-300 animate-bounce rounded-full"></div>
      <div className="w-2 h-2 bg-neutral-300 animate-bounce rounded-full"></div>
      <div className="w-2 h-2 bg-neutral-300 animate-bounce rounded-full"></div>
    </div>
  );
};

export default LoadingDots;
