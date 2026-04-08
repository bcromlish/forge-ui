import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./search-input";

const meta: Meta<typeof SearchInput> = {
  title: "Patterns/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: function SearchInputDefault() {
    const [value, setValue] = useState("");
    return (
      <SearchInput
        value={value}
        onChange={setValue}
        className="w-[300px]"
      />
    );
  },
};

export const WithValue: Story = {
  render: function SearchInputWithValue() {
    const [value, setValue] = useState("search term");
    return (
      <SearchInput
        value={value}
        onChange={setValue}
        className="w-[300px]"
      />
    );
  },
};

export const CustomPlaceholder: Story = {
  render: function SearchInputCustom() {
    const [value, setValue] = useState("");
    return (
      <SearchInput
        value={value}
        onChange={setValue}
        placeholder="Filter candidates..."
        className="w-[300px]"
      />
    );
  },
};
