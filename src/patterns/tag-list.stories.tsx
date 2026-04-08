import type { Meta, StoryObj } from "@storybook/react";
import { TagList } from "./tag-list";

const meta: Meta<typeof TagList> = {
  title: "Patterns/TagList",
  component: TagList,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["secondary", "outline"] },
    max: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof TagList>;

export const Default: Story = {
  args: {
    items: ["React", "TypeScript", "Node.js", "GraphQL"],
  },
};

export const OutlineVariant: Story = {
  args: {
    items: ["Design", "Product", "Engineering"],
    variant: "outline",
  },
};

export const WithOverflow: Story = {
  args: {
    items: ["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Redis", "Docker"],
    max: 3,
  },
};

export const SingleItem: Story = {
  args: {
    items: ["Solo Tag"],
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};
