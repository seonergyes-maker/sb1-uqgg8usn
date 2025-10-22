import { z } from "zod";

// Define your data models here
// This file is shared between frontend and backend to ensure type consistency

// Example schema - replace with your actual data models
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
});

export type User = z.infer<typeof userSchema>;
