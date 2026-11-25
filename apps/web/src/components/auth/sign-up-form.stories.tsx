import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignUpForm } from "./sign-up-form";

const meta = {
  title: "Auth/SignUpForm",
  component: SignUpForm,
  tags: ["autodocs"],
} satisfies Meta<typeof SignUpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
