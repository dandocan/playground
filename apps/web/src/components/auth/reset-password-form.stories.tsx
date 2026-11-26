import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ResetPasswordForm } from "./reset-password-form";

const meta = {
  title: "Auth/ResetPasswordForm",
  component: ResetPasswordForm,
  tags: ["autodocs"],
} satisfies Meta<typeof ResetPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { token: "example-token" } };

export const InvalidLink: Story = {};
