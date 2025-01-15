"use client";
import { useSelector } from "react-redux";
import { AppSidebar } from "./app-sidebar";
import { ResizablePanelGroup, ResizablePanel } from "./ui/resizable";
import Display from "./display";
import { selectRoot, ComponentTree } from "@/store/displaySlice";
const AppRoot: React.FC = ({}) => {
  const root: ComponentTree = useSelector(selectRoot);
  return (
    <ResizablePanelGroup direction="horizontal">
      <AppSidebar />
      <ResizablePanel>
        <Display
          direction={root.direction ?? "horizontal"}
          components={root.components}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
export default AppRoot;
