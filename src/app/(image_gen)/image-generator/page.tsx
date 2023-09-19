"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import React, { FormEvent, useState } from "react";

const ImageGeneratorAppPage = () => {
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_TOKEN}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({ inputs: input }),
        }
      );

      if (!res.ok) {
        throw new Error("Could not generate image.");
      }

      const blob = await res.blob();
      setImage(URL.createObjectURL(blob));

      toast({
        title: "Successfully generated image",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error as string,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadBlobImage = async (url: string, fileName: string) => {
    try {
      // Fetch the blob data from the blob URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download image. Status: ${response.status}`);
      }

      // Get the blob data from the response
      const blobData = await response.blob();

      // Create a temporary URL for the blob data
      const blobUrl = window.URL.createObjectURL(blobData);

      // Create a link element for downloading the blob
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;

      // Programmatically click the link to trigger the download
      link.click();

      // Clean up: remove the temporary blob URL
      window.URL.revokeObjectURL(blobUrl);

      toast({
        title: `Image "${fileName}" downloaded successfully.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: `Error downloading image: ${error}`,
        description: `${error}`,
        variant: "error",
      });
    }
  };

  return (
    <div>
      <Navbar title="AI Image Generator" />
      <div className="container md:max-w-[45%] max-w-[95%] overflow-y-auto my-16 flex flex-col items-center mx-auto gap-y-5">
        <h3 className="max-w-5xl text-2xl md:text-4xl text-blue-500 font-bold tracking-wide text-center">
          Generate Creative Images using Text Prompts
        </h3>
        <form
          className="w-full border-red-400 p-2 flex flex-col gap-y-6"
          onSubmit={handleSubmit}
        >
          <Input
            type="text"
            name="prompt"
            placeholder="Enter your prompt"
            className="shadow-lg backdrop-blur-md"
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            Generate Image
          </Button>
        </form>
        {loading ? <Skeleton className="w-full h-16" /> : null}
        {!loading && image ? (
          <Image
            className="object-contain"
            loading="lazy"
            src={image}
            alt="generated-image"
            width={512}
            height={300}
          />
        ) : null}
        {image ? (
          <Button
            className="bg-orange-400 text-white"
            onClick={() =>
              downloadBlobImage(
                image,
                `generated-image-${new Date().getTime()}.jpg`
              )
            }
          >
            Download Image
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ImageGeneratorAppPage;
