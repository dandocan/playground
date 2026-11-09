import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertCircle, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <Terminal />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>The API will be redeployed tonight.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <AlertCircle />
      <AlertTitle>Deployment failed</AlertTitle>
      <AlertDescription>The API service did not respond to the health check.</AlertDescription>
    </Alert>
  ),
};
