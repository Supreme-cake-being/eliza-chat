import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import Chat from "./Chat.vue";

// Mocks
const viMessages = ref<any[]>([]);
const viIsLoading = ref(false);

const viAddMessage = vi.fn((author, text) => {
  viMessages.value.push({
    id: crypto.randomUUID(),
    author,
    text,
    time: "10:00",
  });
});

const viClearChat = vi.fn(() => {
  viMessages.value = [];
});

vi.mock("@/composables/useChat/useChat", () => ({
  useChat: () => ({
    messages: viMessages,
    isLoading: viIsLoading,
    addMessage: viAddMessage,
    viClearChat: viClearChat,
  }),
}));

const viSendMessageMock = vi.fn();

vi.mock("@/services/eliza.service", () => ({
  sendMessage: viSendMessageMock,
}));

// Helpers
function mountChat() {
  return mount(Chat, {
    global: {
      stubs: {
        Message: {
          props: ["message"],
          template: `<li class="message">{{ message.text }}</li>`,
        },
        Input: {
          props: ["loading"],
          emits: ["send"],
          template: `
            <button class="send-btn" @click="$emit('send', 'Hello')" />
          `,
        },
      },
    },
  });
}

// Tests
describe("Chat.vue", () => {
  beforeEach(() => {
    viMessages.value = [];
    viIsLoading.value = false;
    vi.clearAllMocks();
  });

  it("renders chat and initial state", () => {
    const wrapper = mountChat();

    expect(wrapper.text()).toContain("Chat Eliza");
    expect(wrapper.text()).toContain("Ready");
  });

  it("sends message and receives bot reply", async () => {
    viSendMessageMock.mockResolvedValueOnce("Hi, human");

    const wrapper = mountChat();

    await wrapper.find(".send-btn").trigger("click");

    expect(viAddMessage).toHaveBeenCalledWith("user", "Hello");
    expect(viIsLoading.value).toBe(true);

    await vi.runAllTicks();

    expect(viSendMessageMock).toHaveBeenCalledWith("Hello");
    expect(viAddMessage).toHaveBeenCalledWith("bot", "Hi, human");
    expect(viIsLoading.value).toBe(false);

    expect(wrapper.findAll(".message")).toHaveLength(2);
  });

  it("shows system message on error", async () => {
    viSendMessageMock.mockRejectedValueOnce(new Error("Network"));

    const wrapper = mountChat();

    await wrapper.find(".send-btn").trigger("click");
    await vi.runAllTicks();

    expect(viAddMessage).toHaveBeenCalledWith(
      "system",
      "Network error. Please try again.",
    );
  });

  it("clears chat on Clear button click", async () => {
    viMessages.value = [{ id: "1", author: "user", text: "Hi" }];

    const wrapper = mountChat();

    await wrapper.find("button.btn--ghost").trigger("click");

    expect(viClearChat).toHaveBeenCalled();
    expect(viMessages.value).toHaveLength(0);
  });

  it("disables sending while loading", async () => {
    viIsLoading.value = true;

    const wrapper = mountChat();
    await wrapper.find(".send-btn").trigger("click");

    expect(viAddMessage).not.toHaveBeenCalled();
    expect(viSendMessageMock).not.toHaveBeenCalled();
  });
});
