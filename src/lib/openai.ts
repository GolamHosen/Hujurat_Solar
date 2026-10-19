import OpenAI from "openai";

/**
 * Shared OpenAI client instance.
 * Uses the OPENAI_API_KEY environment variable.
 * Throws a clear error if the key is missing.
 */

const globalForOpenAI = globalThis as typeof globalThis & {
  __openaiClient?: OpenAI;
};

function createClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to your .env file or Vercel environment variables."
    );
  }
  return new OpenAI({ apiKey });
}

export function getOpenAI(): OpenAI {
  if (!globalForOpenAI.__openaiClient) {
    globalForOpenAI.__openaiClient = createClient();
  }
  return globalForOpenAI.__openaiClient;
}

/** Default model to use across the marketing tools */
export const AI_MODEL = "gpt-4o-mini";
