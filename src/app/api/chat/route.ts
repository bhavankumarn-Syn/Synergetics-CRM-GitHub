import {
  streamText,
  UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Ollama exposes an OpenAI-compatible API at /v1, so we can drive it with the
// standard provider instead of hand-rolling the stream conversion.
const ollama = createOpenAI({
  name: 'ollama',
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
  apiKey: 'ollama', // required by the provider, ignored by Ollama
});

// Must match a tag from `ollama list`.
const MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2:1b';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log('Mesgg ------- >>>> ', messages)

  const result = streamText({
    // `.chat()` targets /v1/chat/completions; the default `ollama(...)` would
    // use the Responses API, which Ollama does not implement.
    model: ollama.chat(MODEL),
    messages: await convertToModelMessages(messages),
  });
  console.log('result ===== <<<<< ', result.stream)

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
