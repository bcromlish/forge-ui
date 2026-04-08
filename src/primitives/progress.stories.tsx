import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: { value: 60 },
};

export const Empty: Story = {
  args: { value: 0 },
};

export const Half: Story = {
  args: { value: 50 },
};

export const Full: Story = {
  args: { value: 100 },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <p className="text-sm mb-1">Upload: 25%</p>
        <Progress value={25} />
      </div>
      <div>
        <p className="text-sm mb-1">Processing: 60%</p>
        <Progress value={60} />
      </div>
      <div>
        <p className="text-sm mb-1">Complete: 100%</p>
        <Progress value={100} />
      </div>
    </div>
  ),
};
