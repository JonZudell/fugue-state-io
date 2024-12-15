import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Workspace from './Workspace'; // Adjust the import path as necessary
import { Provider } from 'react-redux';
import store from '../store'; // Adjust the import path as necessary
const meta = {
  component: Workspace,
} satisfies Meta<typeof Workspace>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => (
    <Provider store={store}>
      <Workspace />
    </Provider>
  ),
};
