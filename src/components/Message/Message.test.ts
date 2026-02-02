import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Message from "./Message.vue";
import type { ChatMessage } from "@/types/chat";

function mountMessage(message: ChatMessage) {
  return mount(Message, {
    props: { message },
  });
}

describe("Message.vue", () => {
  it("renders user message correctly", () => {
    const message: ChatMessage = {
      id: "1",
      author: "user",
      text: "Hello",
      time: "10:00",
    };

    const wrapper = mountMessage(message);

    expect(wrapper.text()).toContain("You");
    expect(wrapper.text()).toContain("Hello");
    expect(wrapper.text()).toContain("10:00");
    expect(wrapper.classes()).toContain("msg--user");
  });

  it("renders bot message correctly", () => {
    const message: ChatMessage = {
      id: "2",
      author: "bot",
      text: "Hi, human",
      time: "10:01",
    };

    const wrapper = mountMessage(message);

    expect(wrapper.text()).toContain("Eliza");
    expect(wrapper.text()).toContain("Hi, human");
    expect(wrapper.classes()).toContain("msg--bot");
  });

  it("renders system message without time", () => {
    const message: ChatMessage = {
      id: "3",
      author: "system",
      text: "Network error",
    };

    const wrapper = mountMessage(message);

    expect(wrapper.text()).toContain("System");
    expect(wrapper.text()).toContain("Network error");
    expect(wrapper.find(".msg__time").exists()).toBe(false);
    expect(wrapper.classes()).toContain("msg--system");
  });

  it("does not render time if time is undefined", () => {
    const message: ChatMessage = {
      id: "4",
      author: "user",
      text: "No time here",
    };

    const wrapper = mountMessage(message);

    expect(wrapper.find(".msg__time").exists()).toBe(false);
  });
});
