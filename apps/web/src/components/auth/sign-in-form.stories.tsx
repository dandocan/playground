import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignInForm } from "./sign-in-form";

const meta = {
  title: "Auth/SignInForm",
  component: SignInForm,
  tags: ["autodocs"],
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
