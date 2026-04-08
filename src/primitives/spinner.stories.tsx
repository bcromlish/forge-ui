import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Large: Story = {
  args: { className: "size-8" },
};

export const Small: Story = {
  args: { className: "size-3" },
};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  ),
};

export const Centered: Story = {
  render: () => (
    <div className="flex items-center justify-center h-32 border rounded-md border-dashed">
      <Spinner className="size-6" />
    </div>
  ),
};
