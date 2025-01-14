import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Display from "@/components/display"; // Adjust the import path as necessary
import store from "@/store";
import { Provider } from "react-redux";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

const meta = {
  component: Display,
} satisfies Meta<typeof Display>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <Provider store={store}>
      <SidebarProvider>
        <Display
          direction="horizontal"
          components={[
            <div
              key="blue"
              style={{ flex: 1, backgroundColor: "blue" }}
              className="w-full h-full"
            />,
            <div
              key="red"
              style={{ flex: 1, backgroundColor: "red" }}
              className="w-full h-full"
            />,
          ]}
        />
      </SidebarProvider>
    </Provider>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Provider store={store}>
      <SidebarProvider>
        <Display
          direction="vertical"
          components={[
            <div
              key="blue"
              style={{ flex: 1, backgroundColor: "blue" }}
              className="w-full h-full"
            />,
            <div
              key="red"
              style={{ flex: 1, backgroundColor: "red" }}
              className="w-full h-full"
            />,
          ]}
        />
      </SidebarProvider>
    </Provider>
  ),
};
export const ThreeVertical: Story = {
  render: () => (
    <Provider store={store}>
      <SidebarProvider>
        <Display
          direction="vertical"
          components={[
            <div
              key="blue"
              style={{ flex: 1, backgroundColor: "blue" }}
              className="w-full h-full"
            />,
            <div
              key="red"
              style={{ flex: 1, backgroundColor: "red" }}
              className="w-full h-full"
            />,
            <div
              key="green"
              style={{ flex: 1, backgroundColor: "green" }}
              className="w-full h-full"
            />,
          ]}
        />
      </SidebarProvider>
    </Provider>
  ),
};

export const VerticalTopSplit: Story = {
  render: () => (
    <Provider store={store}>
      <SidebarProvider>
        <Display
          direction="vertical"
          components={[
            <ResizablePanelGroup
              key="top"
              direction="horizontal"
              className="h-full w-full"
            >
              <ResizablePanel>
                <div
                  style={{ flex: 1, backgroundColor: "blue" }}
                  className="w-full h-full"
                />
              </ResizablePanel>
              <ResizableHandle withHandle={true} />
              <ResizablePanel>
                <div
                  style={{ flex: 1, backgroundColor: "red" }}
                  className="w-full h-full"
                />
              </ResizablePanel>
            </ResizablePanelGroup>,
            <div
              key="bottom"
              style={{ flex: 1, backgroundColor: "green" }}
              className="w-full h-full"
            />,
          ]}
        />
      </SidebarProvider>
    </Provider>
  ),
};

export const HorizontalThreeSide: Story = {
  render: () => (
    <Provider store={store}>
      <SidebarProvider>
        <Display
          direction="horizontal"
          components={[
            <ResizablePanelGroup
              key="top"
              direction="vertical"
              className="h-full w-full"
            >
              <ResizablePanel>
                <div
                  style={{ flex: 1, backgroundColor: "blue" }}
                  className="w-full h-full"
                />
              </ResizablePanel>
              <ResizableHandle withHandle={true} />
              <ResizablePanel>
                <div
                  style={{ flex: 1, backgroundColor: "red" }}
                  className="w-full h-full"
                />
              </ResizablePanel>
              <ResizableHandle withHandle={true} />
              <ResizablePanel>
                <div
                  style={{ flex: 1, backgroundColor: "yellow" }}
                  className="w-full h-full"
                />
              </ResizablePanel>
            </ResizablePanelGroup>,
            <div
              key="bottom"
              style={{ flex: 1, backgroundColor: "green" }}
              className="w-full h-full"
            />,
            <div
              key="bottomest"
              style={{ flex: 1, backgroundColor: "purple" }}
              className="w-full h-full"
            />,
          ]}
        />
      </SidebarProvider>
    </Provider>
  ),
};
