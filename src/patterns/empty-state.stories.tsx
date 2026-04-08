import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { Button } from "../primitives/button";
import { InboxIcon, SearchIcon, FileTextIcon } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "Patterns/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <InboxIcon />,
    title: "No items yet",
    description: "Get started by creating your first item.",
    action: <Button>Create Item</Button>,
  },
};

export const NoResults: Story = {
  args: {
    icon: <SearchIcon />,
    title: "No results found",
    description: "Try adjusting your search or filter to find what you are looking for.",
  },
};

export const NoDocuments: Story = {
  args: {
    icon: <FileTextIcon />,
    title: "No documents",
    description: "Documents will appear here once they are created.",
    action: <Button variant="outline">Upload Document</Button>,
  },
};

export const MinimalNoIcon: Story = {
  args: {
    title: "Nothing here",
    description: "This section is empty.",
  },
};
