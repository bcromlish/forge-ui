import type { Meta, StoryObj } from "@storybook/react";
import { ActionGroup } from "./action-group";
import { EyeIcon, PencilIcon, TrashIcon, CopyIcon } from "lucide-react";
import { fn } from "@storybook/test";

const meta: Meta<typeof ActionGroup> = {
  title: "Patterns/ActionGroup",
  component: ActionGroup,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["xs", "sm"] },
  },
};

export default meta;
type Story = StoryObj<typeof ActionGroup>;

export const Default: Story = {
  args: {
    actions: [
      { key: "view", label: "View", icon: <EyeIcon />, onClick: fn() },
      { key: "edit", label: "Edit", icon: <PencilIcon />, onClick: fn() },
      {
        key: "delete",
        label: "Delete",
        icon: <TrashIcon />,
        destructive: true,
        onClick: fn(),
      },
    ],
  },
};

export const ExtraSmall: Story = {
  args: {
    size: "xs",
    actions: [
      { key: "view", label: "View", icon: <EyeIcon />, onClick: fn() },
      { key: "copy", label: "Copy", icon: <CopyIcon />, onClick: fn() },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    actions: [
      { key: "edit", label: "Edit", icon: <PencilIcon />, onClick: fn() },
      {
        key: "delete",
        label: "Delete",
        icon: <TrashIcon />,
        destructive: true,
        disabled: true,
        onClick: fn(),
      },
    ],
  },
};
