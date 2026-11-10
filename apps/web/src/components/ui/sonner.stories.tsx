import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <Toaster />
      <Button onClick={() => toast("Event has been created")}>Show toast</Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Deployment succeeded", { description: "web is live." })}
      >
        Show success
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error("Deployment failed", { description: "Health check timed out." })}
      >
        Show error
      </Button>
    </div>
  ),
};
