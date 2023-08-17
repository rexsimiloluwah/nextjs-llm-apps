import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Document } from "langchain/document";
import ReactMarkdown from "react-markdown";

interface SourceDocumentAccordionProps {
  sourceDocuments?: Document[];
}

const SourceDocumentsAccordion: React.FC<SourceDocumentAccordionProps> = ({
  sourceDocuments,
}) => {
  return (
    <Accordion type="single" collapsible className="flex-col p-2">
      {sourceDocuments && (
        <div className="flex flex-col">
          {sourceDocuments.map((doc, index) => (
            <div key={`messageSourceDocs-${index}`}>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>
                  <h3>Source {index + 1}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <ReactMarkdown linkTarget="_blank">
                    {doc.pageContent}
                  </ReactMarkdown>
                  <p className="mt-2">
                    <b>Source:</b> {doc.metadata.source}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </div>
      )}
    </Accordion>
  );
};

export default SourceDocumentsAccordion;
