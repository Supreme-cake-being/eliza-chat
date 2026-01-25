<template>
  <div class="page">
    <div class="chat-card">
      <!-- Header -->
      <header class="chat-header">
        <div class="chat-title">
          <div class="chat-title__name">Chat Eliza</div>
          <div class="chat-title__sub">Vue 3 + TypeScript + ConnectRPC</div>
        </div>

        <div class="chat-actions">
          <button class="btn btn--ghost" type="button" @click="clearChat">
            Clear
          </button>
        </div>
      </header>

      <!-- Chat -->
      <main class="chat-body" ref="chatBody">
        <ul class="messages" aria-label="Chat messages">
          <li
            v-for="msg in messages"
            :key="msg.id"
            class="msg"
            :class="`msg--${msg.author}`"
          >
            <div class="msg__bubble">
              <div class="msg__meta">
                {{ authorLabel(msg.author) }}
                <span v-if="msg.time" class="msg__time">{{ msg.time }}</span>
              </div>
              <div class="msg__text">{{ msg.text }}</div>
            </div>
          </li>
        </ul>
      </main>

      <!-- Footer -->
      <footer class="chat-footer">
        <form class="composer" @submit.prevent="handleSend">
          <div class="composer__field">
            <label class="sr-only" for="message">Message</label>

            <!-- textarea for Shift+Enter -->
            <textarea
              id="message"
              ref="inputRef"
              class="input"
              v-model="input"
              placeholder="Type your message…"
              rows="1"
              :disabled="isLoading"
              @keydown.enter.exact.prevent="handleSend"
              @keydown.enter.shift
            />

            <div class="composer__hint">
              Enter — send • Shift+Enter — new line
            </div>
          </div>

          <button
            class="btn btn--primary"
            type="submit"
            :disabled="!isValid || isLoading"
            :class="{ 'is-loading': isLoading }"
          >
            <span class="btn__text">
              {{ isLoading ? "Sending…" : "Send" }}
            </span>
            <span class="btn__spinner" aria-hidden="true"></span>
          </button>
        </form>

        <div class="status">
          <span class="status__dot"></span>
          <span class="status__text">
            {{ isLoading ? "Sending message…" : "Ready" }}
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { sendMessage } from "@/services/eliza.service";
import type { ChatMessage, MessageAuthor } from "@/types/chat";

const messages = ref<ChatMessage[]>([]);
const input = ref("");
const isLoading = ref(false);

const inputRef = ref<HTMLTextAreaElement | null>(null);
const chatBody = ref<HTMLElement | null>(null);

/* ===== Validation ===== */
const isValid = computed(() => input.value.trim().length > 0);

/* ===== Helpers ===== */
function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function authorLabel(author: MessageAuthor) {
  if (author === "user") return "You";
  if (author === "bot") return "Eliza";
  return "System";
}

function addMessage(author: MessageAuthor, text: string) {
  messages.value.push({
    id: crypto.randomUUID(),
    author,
    text,
    time: author !== "system" ? now() : undefined,
  });

  scrollToBottom();
}

async function scrollToBottom() {
  await nextTick();
  chatBody.value?.scrollTo({
    top: chatBody.value.scrollHeight,
    behavior: "smooth",
  });
}

/* ===== Actions ===== */
async function handleSend() {
  if (!isValid.value || isLoading.value) return;

  const text = input.value.trim();

  addMessage("user", text);
  input.value = "";
  isLoading.value = true;

  try {
    const reply = await sendMessage(text);
    addMessage("bot", reply);
  } catch {
    addMessage("system", "Network error. Please try again.");
  } finally {
    isLoading.value = false;
    inputRef.value?.focus();
  }
}

function clearChat() {
  messages.value = [];
  inputRef.value?.focus();
}
</script>
