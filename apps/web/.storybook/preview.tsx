import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";
import { TooltipProvider } from "../src/components/ui/tooltip";

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
