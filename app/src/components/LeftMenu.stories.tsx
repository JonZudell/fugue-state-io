import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import LeftMenu from './LeftMenu'; // Adjust the import path as necessary

const meta = {
  component: LeftMenu,
} satisfies Meta<typeof LeftMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {
  render: () => <LeftMenu />,
};
