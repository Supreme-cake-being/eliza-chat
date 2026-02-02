import { describe, it, expect, beforeEach, vi } from "vitest";
import { useChat } from "./useChat";

const STORAGE_KEY = "test-chat-messages";

vi.mock("@/helpers/now", () => ({
  now: () => "10:00",
}));

describe("useChat", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds a valid message and persists it", () => {
    const { messages, addMessage } = useChat(STORAGE_KEY);

    addMessage("user", "Hello world");

    expect(messages.value).toHaveLength(1);
    expect(messages.value[0]).toMatchObject({
      author: "user",
      text: "Hello world",
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);

    expect(stored).toHaveLength(1);
  });

  it("does not add invalid message", () => {
    const { messages, addMessage } = useChat(STORAGE_KEY);

    addMessage("user", "");

    expect(messages.value).toHaveLength(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("clears messages and localStorage", () => {
    const { messages, addMessage, clearChat } = useChat(STORAGE_KEY);

    addMessage("user", "Hello");
    expect(messages.value).toHaveLength(1);

    clearChat();

    expect(messages.value).toHaveLength(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("restores messages from localStorage if data is valid", async () => {
    const saved = [
      {
        id: "1",
        author: "user",
        text: "Hi",
        time: "12:00",
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    const { messages, restore } = useChat(STORAGE_KEY);

    restore();

    expect(messages.value).toHaveLength(1);
    expect(messages.value[0].text).toBe("Hi");
  });

  it("clears localStorage if stored data is invalid", async () => {
    const invalid = [{ foo: "bar" }];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(invalid));

    const { messages, restore } = useChat(STORAGE_KEY);

    restore();

    expect(messages.value).toHaveLength(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("handles broken JSON safely", async () => {
    localStorage.setItem(STORAGE_KEY, "{ not-json");

    const { messages, restore } = useChat(STORAGE_KEY);

    restore();

    expect(messages.value).toHaveLength(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("adds message with mocked time", () => {
    const { messages, addMessage } = useChat("chat");

    addMessage("user", "Hello");

    expect(messages.value[0]).toEqual(
      expect.objectContaining({
        text: "Hello",
        author: "user",
        time: "10:00",
      }),
    );
  });
});
