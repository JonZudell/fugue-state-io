import React, { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Display from "@/components/display"; // Adjust the import path as necessary
import store from "@/store";
import { Provider } from "react-redux";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppRoot from "@/components/app-root";
import { useDispatch } from "react-redux";
import { setRoot } from "@/store/displaySlice";

const meta = {
  component: AppRoot,
} satisfies Meta<typeof Display>;

export default meta;

type Story = StoryObj<typeof meta>;

export const None: Story = {
  render: (args) => (
    <Provider store={store}>
      <SidebarProvider>
        <AppRoot />
      </SidebarProvider>
    </Provider>
  ),
};
export const Vertical: Story = {
  render: (args) => (
    <Provider store={store}>
      <SidebarProvider>
        <AppRootWithDispatch
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
export const Horizontal: Story = {
  render: (args) => (
    <Provider store={store}>
      <SidebarProvider>
        <AppRootWithDispatch
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
export const Nested: Story = {
  render: (args) => (
    <Provider store={store}>
      <SidebarProvider>
        <AppRootWithDispatch
          direction="horizontal"
          components={[
            <div
              key="blue"
              style={{ flex: 1, backgroundColor: "blue" }}
              className="w-full h-full"
            />,
            <Display
              key="right"
              direction="vertical"
              components={[
                <div
                  key="red"
                  style={{ flex: 1, backgroundColor: "red" }}
                  className="w-full h-full"
                />,
                <div
                  key="red"
                  style={{ flex: 1, backgroundColor: "yellow" }}
                  className="w-full h-full"
                />,
              ]}
            />,
          ]}
        />
      </SidebarProvider>
    </Provider>
  ),
};

const AppRootWithDispatch: React.FC<{
  direction: "vertical" | "horizontal";
  components: ReactNode[];
}> = (root) => {
  const dispatch = useDispatch();
  dispatch(setRoot(root));
  return <AppRoot />;
};
