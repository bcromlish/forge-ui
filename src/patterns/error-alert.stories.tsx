import type { Meta, StoryObj } from "@storybook/react";
import { ErrorAlert } from "./error-alert";

const meta: Meta<typeof ErrorAlert> = {
  title: "Patterns/ErrorAlert",
  component: ErrorAlert,
  tags: ["autodocs"],
  argTypes: {
    message: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorAlert>;

export const Default: Story = {
  args: { message: "Something went wrong. Please try again." },
};

export const LongMessage: Story = {
  args: {
    message:
      "Failed to save your changes. The server returned an unexpected error. Please check your network connection and try again. If the problem persists, contact support.",
  },
};

export const NoMessage: Story = {
  args: { message: undefined },
};

export const ValidationError: Story = {
  args: { message: "Email address is already in use." },
};
