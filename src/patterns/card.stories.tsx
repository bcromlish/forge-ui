import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "../primitives/button";

const meta: Meta<typeof Card> = {
  title: "Patterns/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    interactive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          A description of what this card contains.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Card body content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>Manage your project configuration.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">Edit</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Configure project-specific settings and preferences.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card interactive className="w-[350px]">
      <CardHeader>
        <CardTitle>Clickable Card</CardTitle>
        <CardDescription>
          This card has hover and focus states.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Click or focus to see the interactive styles.</p>
      </CardContent>
    </Card>
  ),
};

export const Minimal: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p className="text-sm">A card with just content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};
