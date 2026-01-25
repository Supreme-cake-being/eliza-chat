export type MessageAuthor = "user" | "bot" | "system";

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  text: string;
  time?: string;
}
