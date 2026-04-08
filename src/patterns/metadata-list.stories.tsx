import type { Meta, StoryObj } from "@storybook/react";
import { MetadataList } from "./metadata-list";
import { MetadataItem } from "./metadata-item";
import { MailIcon, PhoneIcon, MapPinIcon, CalendarIcon } from "lucide-react";

const meta: Meta<typeof MetadataList> = {
  title: "Patterns/MetadataList",
  component: MetadataList,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
};

export default meta;
type Story = StoryObj<typeof MetadataList>;

export const Horizontal: Story = {
  render: () => (
    <MetadataList>
      <MetadataItem icon={<MailIcon />} value="bryan@example.com" href="mailto:bryan@example.com" />
      <MetadataItem icon={<PhoneIcon />} value="+1 (555) 123-4567" />
      <MetadataItem icon={<MapPinIcon />} value="Toronto, ON" />
    </MetadataList>
  ),
};

export const Vertical: Story = {
  render: () => (
    <MetadataList orientation="vertical">
      <MetadataItem icon={<MailIcon />} value="bryan@example.com" href="mailto:bryan@example.com" />
      <MetadataItem icon={<PhoneIcon />} value="+1 (555) 123-4567" />
      <MetadataItem icon={<MapPinIcon />} value="Toronto, ON" />
      <MetadataItem icon={<CalendarIcon />} value="Joined March 2024" />
    </MetadataList>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <MetadataList>
      <MetadataItem icon={<MailIcon />} value="user@test.com" size="sm" />
      <MetadataItem icon={<MapPinIcon />} value="New York" size="sm" />
    </MetadataList>
  ),
};

export const NoIcons: Story = {
  render: () => (
    <MetadataList>
      <MetadataItem value="Product Design" />
      <MetadataItem value="Full-time" />
      <MetadataItem value="Remote" />
    </MetadataList>
  ),
};
