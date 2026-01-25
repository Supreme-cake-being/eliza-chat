<template>
  <li class="msg" :class="`msg--${message.author}`">
    <div class="msg__bubble">
      <div class="msg__meta">
        {{ label }}
        <span v-if="message.time" class="msg__time">
          {{ message.time }}
        </span>
      </div>

      <div class="msg__text">
        {{ message.text }}
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ChatMessage, MessageAuthor } from "@/types/chat";

// Props
const props = defineProps<{
  message: ChatMessage;
}>();

// Computed
const label = computed(() => {
  const author: MessageAuthor = props.message.author;

  if (author === "user") return "You";
  if (author === "bot") return "Eliza";
  return "System";
});
</script>
