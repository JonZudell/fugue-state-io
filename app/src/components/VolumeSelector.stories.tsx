import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import VolumeSelector from "./VolumeSelector"; // Adjust the import path as necessary
import store from "@/store";
import { Provider } from "react-redux";

const meta = {
  component: VolumeSelector,
} satisfies Meta<typeof VolumeSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => (
    <Provider store={store}>
      <VolumeSelector />
    </Provider>
  ),
};
