import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ForgotPasswordForm } from "./forgot-password-form";

const meta = {
  title: "Auth/ForgotPasswordForm",
  component: ForgotPasswordForm,
  tags: ["autodocs"],
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
