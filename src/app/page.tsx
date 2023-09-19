import { ArrowUpRight, GithubIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js LLM Apps",
  description: "LLM-powered applications using LangChain, OpenAI",
};

export default function Home() {
  const exampleApps = [
    {
      title: "Chat with Kati Frantz",
      href: "/chat-with-kati",
    },
    {
      title: "AI Image Generator",
      href: "/image-generator",
    },
  ];

  return (
    <div className="relative flex justify-center">
      <Link
        href="https://github.com/rexsimiloluwah/nextjs-llm-apps"
        target="_blank"
        className="p-2 rounded-full hover:bg-neutral-100 absolute top-4 right-4"
      >
        <GithubIcon size={32} />
      </Link>
      <div className="flex flex-col w-[90vw] md:w-[45vw] mx-auto my-20 justify-center">
        <div className="mb-8 flex flex-col gap-y-3 text-center">
          <h1 className="tracking-tight font-bold text-2xl md:text-4xl">
            Next.js LLM Applications
          </h1>
          <p>
            A suite of LLM-powered applications built using{" "}
            <span className="text-yellow-500 font-semibold">Next.js</span>,{" "}
            <span className="text-yellow-500 font-semibold">LangChain</span>,{" "}
            <span className="text-yellow-500 font-semibold">OpenAI</span>,{" "}
            <span className="text-yellow-500 font-semibold">HuggingFace</span>{" "}
            etc.
          </p>
        </div>
        <div className="flex flex-col w-full gap-y-4 items-center">
          {exampleApps.map((item, id) => (
            <Link
              href={item.href}
              key={id}
              className="bg-blue-500 hover:ring-2 transition group rounded-lg opacity-95 hover:opacity-100 p-4 w-full text-white flex justify-between items-center"
            >
              <p>{item.title}</p>
              <ArrowUpRight size={32} className="group-hover:rotate-45" />
            </Link>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-4">Built with ❤️ by THEBLKDV</footer>
    </div>
  );
}
