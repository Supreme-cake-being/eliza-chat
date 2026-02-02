import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "./Input.vue";

// Mocks
vi.mock("@/helpers/validation", () => ({
  isValidMessageText: (text: string) => text.trim().length > 0,
}));

// Helpers
function mountInput(props?: { loading?: boolean }) {
  return mount(Input, {
    props: {
      loading: false,
      ...props,
    },
  });
}

// Tests
describe("Input.vue", () => {
  it("renders textarea and send button", () => {
    const wrapper = mountInput();

    expect(wrapper.find("textarea").exists()).toBe(true);
    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.text()).toContain("Send");
  });

  it("updates text when typing", async () => {
    const wrapper = mountInput();
    const textarea = wrapper.find("textarea");

    await textarea.setValue("Hello");

    expect((textarea.element as HTMLTextAreaElement).value).toBe("Hello");
    expect(wrapper.text()).toContain("5/200");
  });

  it("disables button when input is invalid", async () => {
    const wrapper = mountInput();
    const button = wrapper.find("button");

    await wrapper.find("textarea").setValue("");

    expect(button.attributes("disabled")).toBeDefined();
  });

  it("emits send event with trimmed text on submit", async () => {
    const wrapper = mountInput();
    const textarea = wrapper.find("textarea");

    await textarea.setValue("  Hello world  ");
    await wrapper.find("form").trigger("submit");

    expect(wrapper.emitted("send")).toBeTruthy();
    expect(wrapper.emitted("send")![0]).toEqual(["Hello world"]);
  });

  it("clears input after sending", async () => {
    const wrapper = mountInput();
    const textarea = wrapper.find("textarea");

    await textarea.setValue("Hello");
    await wrapper.find("form").trigger("submit");

    expect(textarea.element.value).toBe("");
  });

  it("does not emit send when loading is true", async () => {
    const wrapper = mountInput({ loading: true });

    await wrapper.find("textarea").setValue("Hello");
    await wrapper.find("form").trigger("submit");

    expect(wrapper.emitted("send")).toBeFalsy();
  });

  it("sends message on Enter key", async () => {
    const wrapper = mountInput();
    const textarea = wrapper.find("textarea");

    await textarea.setValue("Hello");
    await textarea.trigger("keydown.enter");

    expect(wrapper.emitted("send")).toBeTruthy();
    expect(wrapper.emitted("send")![0]).toEqual(["Hello"]);
  });

  it("does NOT send message on Shift+Enter", async () => {
    const wrapper = mountInput();
    const textarea = wrapper.find("textarea");

    await textarea.setValue("Hello");
    await textarea.trigger("keydown.enter", {
      shiftKey: true,
    });

    expect(wrapper.emitted("send")).toBeFalsy();
  });

  it("focuses textarea when loading becomes false", async () => {
    const wrapper = mount(Input, {
      props: { loading: true },
      attachTo: document.body,
    });

    const textarea = wrapper.find("textarea");
    const focusSpy = vi.spyOn(textarea.element, "focus");

    await wrapper.setProps({ loading: false });

    await Promise.resolve();

    expect(focusSpy).toHaveBeenCalled();
  });
});
