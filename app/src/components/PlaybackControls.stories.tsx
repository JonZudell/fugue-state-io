import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import PlaybackControls from "./PlaybackControls"; // Adjust the import path as necessary
import store from "@/store";
import { Provider } from "react-redux";

const meta = {
  component: PlaybackControls,
} satisfies Meta<typeof PlaybackControls>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => (
    <Provider store={store}>
      <PlaybackControls
        timeElapsed={0}
        width={0}
        height={0}
        loopStart={0}
        setLoopStart={(start: number) => {}}
        loopEnd={0}
        setLoopEnd={function (end: number): void {}}
      />
    </Provider>
  ),
};
