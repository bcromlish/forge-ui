import type { Meta, StoryObj } from "@storybook/react";
import { ActionFooter } from "./action-footer";
import { Button } from "../primitives/button";

const meta: Meta<typeof ActionFooter> = {
  title: "Patterns/ActionFooter",
  component: ActionFooter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActionFooter>;

export const Default: Story = {
  render: () => (
    <ActionFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </ActionFooter>
  ),
};

export const SingleAction: Story = {
  render: () => (
    <ActionFooter>
      <Button>Submit</Button>
    </ActionFooter>
  ),
};

export const ThreeActions: Story = {
  render: () => (
    <ActionFooter>
      <Button variant="ghost">Reset</Button>
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </ActionFooter>
  ),
};

export const DestructiveAction: Story = {
  render: () => (
    <ActionFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </ActionFooter>
  ),
};
