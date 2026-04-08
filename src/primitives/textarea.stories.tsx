import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";
import { Label } from "./label";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Type your message here..." },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Write a message..." />
    </div>
  ),
};

export const Disabled: Story = {
  args: { placeholder: "Disabled textarea", disabled: true },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: "This textarea has some default content that the user can edit.",
  },
};
