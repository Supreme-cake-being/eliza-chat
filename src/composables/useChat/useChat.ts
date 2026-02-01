import { ref, onMounted } from "vue";
import type { ChatMessage, MessageAuthor } from "@/types/chat";
import { isChatMessageArray, isValidMessageText } from "@/helpers/validation";
import { now } from "@/helpers/now";

export function useChat(storageKey: string) {
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);

  function persist() {
    localStorage.setItem(storageKey, JSON.stringify(messages.value));
  }

  function restore() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (isChatMessageArray(parsed)) {
        messages.value = parsed;
      } else {
        throw new Error();
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }

  function addMessage(author: MessageAuthor, text: string) {
    if (!isValidMessageText(text)) return;

    messages.value.push({
      id: crypto.randomUUID(),
      author,
      text,
      time: author !== "system" ? now() : undefined,
    });

    persist();
  }

  function clearChat() {
    messages.value = [];
    localStorage.removeItem(storageKey);
  }

  onMounted(restore);

  return {
    messages,
    isLoading,
    restore,
    addMessage,
    clearChat,
  };
}
