import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "./tag-input";

const meta: Meta<typeof TagInput> = {
  title: "Patterns/TagInput",
  component: TagInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: function TagInputDefault() {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <TagInput
        value={tags}
        onChange={setTags}
        className="w-[300px]"
      />
    );
  },
};

export const WithExistingTags: Story = {
  render: function TagInputWithTags() {
    const [tags, setTags] = useState(["React", "TypeScript", "Tailwind"]);
    return (
      <TagInput
        value={tags}
        onChange={setTags}
        placeholder="Add a skill..."
        className="w-[300px]"
      />
    );
  },
};

export const CustomPlaceholder: Story = {
  render: function TagInputCustom() {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <TagInput
        value={tags}
        onChange={setTags}
        placeholder="Add certification..."
        className="w-[300px]"
      />
    );
  },
};
