import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import PlaybackArea from './PlaybackArea'; // Adjust the import path as necessary
import { Provider } from 'react-redux';
import store from '../store';

const meta = {
  component: PlaybackArea,
} satisfies Meta<typeof PlaybackArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () =>
    <Provider store={store}>
      <PlaybackArea />
    </Provider>,
};
