import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialButtons } from "./social-buttons";

const meta = {
  title: "Auth/SocialButtons",
  component: SocialButtons,
  tags: ["autodocs"],
} satisfies Meta<typeof SocialButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
