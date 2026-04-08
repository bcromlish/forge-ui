import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge, type StatusBadgeStatus } from "./status-badge";

const meta: Meta<typeof StatusBadge> = {
  title: "Patterns/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: [
        "draft", "active", "paused", "closed", "archived",
        "pending_approval", "approved", "hired", "rejected",
        "scheduled", "completed", "sent", "accepted", "declined",
        "published",
      ] satisfies StatusBadgeStatus[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Active: Story = {
  args: { status: "active" },
};

export const Draft: Story = {
  args: { status: "draft" },
};

export const Paused: Story = {
  args: { status: "paused" },
};

export const Closed: Story = {
  args: { status: "closed" },
};

export const Archived: Story = {
  args: { status: "archived" },
};

export const AllStatuses: Story = {
  render: () => {
    const statuses: StatusBadgeStatus[] = [
      "draft", "active", "paused", "closed", "archived",
      "pending_approval", "approved", "partially_filled", "filled",
      "cancelled", "hired", "rejected", "withdrawn", "on_hold",
      "pending_schedule", "scheduled", "completed", "no_show",
      "sent", "accepted", "declined", "expired",
      "submitted", "revised", "published", "advanced",
    ];
    return (
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </div>
    );
  },
};
