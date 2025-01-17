import React, { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Display from "@/components/display"; // Adjust the import path as necessary
import store from "@/store";
import { Provider } from "react-redux";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppRoot from "@/components/app-root";
import { useDispatch } from "react-redux";
import { setLayout, setOrder } from "@/store/display-slice";

const meta = {
  component: AppRoot,
} satisfies Meta<typeof AppRoot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const None: Story = {
  render: (args) => (
    <Provider store={store}>
      <SidebarProvider>
        <AppRootWithDispatch layout="none" order={[]} />
      </SidebarProvider>
    </Provider>
  ),
};
export const SideBySide: Story = {
  render: (args) => (
    <Provider store={store}>
      <SidebarProvider>
        <AppRootWithDispatch
          layout="side-by-side"
          order={["waveform", "fourier"]}
        />
      </SidebarProvider>
    </Provider>
  ),
};
export const Stacked: Story = {
  render: (args) => (
    <Provider store={store}>
      <SidebarProvider>
        <AppRootWithDispatch layout="stacked" order={["waveform", "fourier"]} />
      </SidebarProvider>
    </Provider>
  ),
};

const AppRootWithDispatch: React.FC<{
  layout: string;
  order: ("waveform" | "fourier" | "spectrogram" | "video")[];
}> = ({ order, layout }) => {
  const dispatch = useDispatch();
  dispatch(setLayout(layout));
  dispatch(setOrder(order));
  return <AppRoot />;
};
