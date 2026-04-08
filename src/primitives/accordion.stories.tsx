import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Primitives/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "solid"],
    },
    indicator: {
      control: "select",
      options: ["chevron", "plus-minus"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the other components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It animates opening and closing by default.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const OutlineVariant: Story = {
  render: () => (
    <Accordion type="single" collapsible variant="outline" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is included?</AccordionTrigger>
        <AccordionContent>
          Everything you need to build modern applications.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Can I customize it?</AccordionTrigger>
        <AccordionContent>
          Absolutely. All components are fully customizable.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const SolidVariant: Story = {
  render: () => (
    <Accordion type="single" collapsible variant="solid" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>FAQ Item 1</AccordionTrigger>
        <AccordionContent>
          Answer to frequently asked question one.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>FAQ Item 2</AccordionTrigger>
        <AccordionContent>
          Answer to frequently asked question two.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const PlusMinusIndicator: Story = {
  render: () => (
    <Accordion type="single" collapsible indicator="plus-minus" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section One</AccordionTrigger>
        <AccordionContent>Content for section one.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section Two</AccordionTrigger>
        <AccordionContent>Content for section two.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can multiple open?</AccordionTrigger>
        <AccordionContent>
          Yes, when type is set to multiple.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Open me too</AccordionTrigger>
        <AccordionContent>Both items can be open.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
