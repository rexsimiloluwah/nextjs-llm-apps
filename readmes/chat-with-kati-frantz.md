# Chat with Kati Frantz

## Background Story

I have been receiving Kati Frantz's newsletters for a few months now and it has become something I look forward to weekly because of the practical ideas and invaluable advice it offers. This app provides a way to perform an LLM-powered QA over the "golden nuggets" shared in those newsletters, using `LangChain` and the `OpenAI API`.

## How it works?

The app works by performing question-answering over the content of the newsletter mails sent by Kati Frantz using LLMs. Firstly, the required data is fetched from Gmail using the [Google Gmail API](https://developers.google.com/gmail/api/guides), then transformed and stored locally in `.txt` files. The stored documents are loaded, split, and a vector store (`Pinecone`) is used to store the embeddings generated using `OpenAI`.

When a query is sent to the application, the relevant documents to the query are retrieved from the vector store and passed as a context to the LLM to generate a desired response.

A comprehensive review of the pipeline for performing QA over documents is available [HERE](https://python.langchain.com/docs/use_cases/question_answering/).
