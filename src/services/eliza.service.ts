import { elizaClient } from "@/rpc/eliza.client";

export async function sendMessage(text: string): Promise<string> {
  const response = await elizaClient.say({
    sentence: text,
  });

  return response.sentence;
}
