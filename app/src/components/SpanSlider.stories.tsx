import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import SpanSlider from "./SpanSlider"; // Adjust the import path as necessary
import { Provider } from "react-redux";
import store from "../store"; // Adjust the import path as necessary
const meta = {
  component: SpanSlider,
} satisfies Meta<typeof SpanSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => (
    <Provider store={store}>
      <SpanSlider />
    </Provider>
  ),
};
