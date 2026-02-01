import {
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
} from "@/constants/stringValidation";
import { ChatMessage, MessageAuthor } from "@/types/chat";

export function isValidMessageText(value: unknown): value is string {
  if (typeof value !== "string") return false;

  const trimmed = value.trim();

  return (
    trimmed.length >= MIN_MESSAGE_LENGTH && trimmed.length <= MAX_MESSAGE_LENGTH
  );
}

function isMessageAuthor(value: unknown): value is MessageAuthor {
  return value === "user" || value === "bot" || value === "system";
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== "object" || value === null) return false;

  const msg = value as Record<string, unknown>;

  return (
    typeof msg.id === "string" &&
    isValidMessageText(msg.text) &&
    isMessageAuthor(msg.author) &&
    (msg.time === undefined || typeof msg.time === "string")
  );
}

export function isChatMessageArray(value: unknown): value is ChatMessage[] {
  return Array.isArray(value) && value.every(isChatMessage);
}
