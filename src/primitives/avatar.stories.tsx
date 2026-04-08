import type { Meta, StoryObj } from "@storybook/react";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarStatus,
} from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackInitials: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback name="Bryan Cromlish">BC</AvatarFallback>
    </Avatar>
  ),
};

export const DefaultFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>?</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar size="xs">
        <AvatarFallback name="Alice">A</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback name="Bob">B</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback name="Carol">C</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback name="Dave">D</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback name="Eve">E</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const SquareShape: Story = {
  render: () => (
    <Avatar shape="square" size="lg">
      <AvatarFallback name="Team">T</AvatarFallback>
    </Avatar>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar>
        <AvatarFallback name="Online User">ON</AvatarFallback>
        <AvatarStatus status="online" />
      </Avatar>
      <Avatar>
        <AvatarFallback name="Away User">AW</AvatarFallback>
        <AvatarStatus status="away" />
      </Avatar>
      <Avatar>
        <AvatarFallback name="Offline User">OF</AvatarFallback>
        <AvatarStatus status="offline" />
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar>
        <AvatarFallback name="Alice">A</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback name="Bob">B</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback name="Carol">C</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback name="Dave">D</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback name="Eve">E</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};
