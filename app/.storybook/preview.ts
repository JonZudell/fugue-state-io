import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import { withCssResources } from "@storybook/addon-cssresources";
export const decorators = [withCssResources];

export const parameters = {
  cssresources: [
    {
      id: `globals`,
      code: `<link rel="stylesheet" type="text/css" href="../src/app/globals.css">`,
      picked: true,
    },
  ],
};
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
