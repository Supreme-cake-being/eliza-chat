<template>
  <form class="composer" @submit.prevent="onSend">
    <div class="composer__field">
      <label class="sr-only" for="message">Message</label>

      <textarea
        id="message"
        ref="inputRef"
        class="input"
        v-model="localValue"
        placeholder="Type your message…"
        rows="1"
        maxlength="200"
        :disabled="loading"
        @keydown.enter.exact.prevent="onSend"
        @keydown.enter.shift
      />

      <div class="composer__hint">
        Enter — send • Shift+Enter — new line • {{ localValue.length }}/200
      </div>
    </div>

    <button
      class="btn btn--primary"
      type="submit"
      :disabled="!isValid || loading"
      :class="{ 'is-loading': loading }"
    >
      <span class="btn__text">
        {{ loading ? "Sending…" : "Send" }}
      </span>
      <span class="btn__spinner" aria-hidden="true"></span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { isValidMessageText } from "@/helpers/validation";
import { ref, computed, nextTick, watch } from "vue";

// Props
const props = defineProps<{
  loading: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "send", text: string): void;
}>();

// State
const localValue = ref("");
const inputRef = ref<HTMLTextAreaElement | null>(null);

// Validation
const isValid = computed(() => isValidMessageText(localValue.value));

// Actions
function onSend() {
  if (!isValid.value || props.loading) return;

  emit("send", localValue.value.trim());
  localValue.value = "";

  nextTick(() => {
    inputRef.value?.focus();
  });
}

watch(
  () => props.loading,
  (loading) => {
    if (!loading) {
      nextTick(() => {
        inputRef.value?.focus();
      });
    }
  },
);
</script>
