import { z } from "zod";

const chatSchema = z.object({
  question: z
    .string({
      required_error: "Question is required",
      invalid_type_error: "Question must be a string",
    })
    .min(10, "Question must be at least 10 characters long"),
  history: z.array(z.string(), {
    required_error: "History is required",
    invalid_type_error: "History must be an array of strings",
  }),
});

export default chatSchema;
