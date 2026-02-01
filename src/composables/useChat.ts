import { ref, onMounted } from "vue";
import type { ChatMessage, MessageAuthor } from "@/types/chat";
import { isChatMessageArray, isValidMessageText } from "@/helpers/validation";

export function useChat(storageKey: string) {
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);

  function persist() {
    localStorage.setItem(storageKey, JSON.stringify(messages.value));
  }

  function now() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  onMounted(() => {
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
  });

  return {
    messages,
    isLoading,
    addMessage,
    clearChat,
  };
}
