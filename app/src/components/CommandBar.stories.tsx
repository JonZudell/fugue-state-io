import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CommandBar from './CommandBar'; // Adjust the import path as necessary

const meta = {
  component: CommandBar,
} satisfies Meta<typeof CommandBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => <CommandBar />,
};
