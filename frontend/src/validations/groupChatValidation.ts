import { z } from "zod";

export const CreateChatSchema = z
  .object({
    title: z
      .string()
      .min(4, { message: "Chat title must be at least 4 characters long" })
      .max(191, {
        message: "Chat title must be less than 191 characters long",
      }),
    passcode: z
      .string()
      .min(4, { message: "Chat passcode must be at least 4 characters long" })
      .max(25, {
        message: "Chat passcode must be less than 25 characters long",
      }),
  })
  .required();

export type CreateChatSchemaType = z.infer<typeof CreateChatSchema>;
