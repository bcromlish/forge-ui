import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
  title: "Primitives/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    showValue: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: [50], max: 100, step: 1, className: "w-[300px]" },
};

export const WithValue: Story = {
  args: {
    defaultValue: [75],
    max: 100,
    step: 1,
    showValue: true,
    className: "w-[300px]",
  },
};

export const RangeSlider: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    showValue: true,
    className: "w-[300px]",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    disabled: true,
    className: "w-[300px]",
  },
};

export const CustomStep: Story = {
  args: {
    defaultValue: [20],
    max: 100,
    step: 10,
    showValue: true,
    className: "w-[300px]",
  },
};
