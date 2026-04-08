import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./toggle";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["default", "sm", "lg"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { children: <BoldIcon />, "aria-label": "Toggle bold" },
};

export const Outline: Story = {
  args: {
    children: <ItalicIcon />,
    variant: "outline",
    "aria-label": "Toggle italic",
  },
};

export const WithText: Story = {
  args: { children: <><UnderlineIcon /> Underline</> },
};

export const Small: Story = {
  args: { children: <BoldIcon />, size: "sm", "aria-label": "Toggle bold" },
};

export const Large: Story = {
  args: { children: <BoldIcon />, size: "lg", "aria-label": "Toggle bold" },
};

export const Disabled: Story = {
  args: {
    children: <BoldIcon />,
    disabled: true,
    "aria-label": "Toggle bold",
  },
};
