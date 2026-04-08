import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "url"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text..." },
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { placeholder: "Disabled input", disabled: true },
};

export const WithError: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="error-input">Username</Label>
      <Input id="error-input" aria-invalid="true" defaultValue="ab" />
      <p className="text-sm text-destructive">Username must be at least 3 characters.</p>
    </div>
  ),
};

export const Password: Story = {
  args: { type: "password", placeholder: "Enter password..." },
};

export const File: Story = {
  args: { type: "file" },
};
