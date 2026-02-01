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
          <Message v-for="msg in messages" :key="msg.id" :message="msg" />
        </ul>
      </main>

      <!-- Footer -->
      <footer class="chat-footer">
        <Input :loading="isLoading" @send="handleSend" />

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
import { ref, nextTick, onMounted } from "vue";
import Input from "@/components/Input.vue";
import Message from "@/components/Message.vue";
import { sendMessage } from "@/services/eliza.service";
import { useChat } from "@/composables/useChat";
import { STORAGE_KEY } from "@/constants/storageKey";

const chatBody = ref<HTMLElement | null>(null);

const { messages, isLoading, addMessage, clearChat } = useChat(STORAGE_KEY);

onMounted(() => scrollToBottom());

// Scroll
async function scrollToBottom() {
  await nextTick();
  chatBody.value?.scrollTo({
    top: chatBody.value.scrollHeight,
    behavior: "smooth",
  });
}

// Actions
async function handleSend(text: string) {
  if (isLoading.value) return;

  addMessage("user", text);
  isLoading.value = true;
  scrollToBottom();

  try {
    const reply = await sendMessage(text);
    addMessage("bot", reply);
  } catch {
    addMessage("system", "Network error. Please try again.");
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
}
</script>
