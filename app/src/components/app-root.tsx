"use client";
import { useSelector } from "react-redux";
import { AppSidebar } from "./app-sidebar";
import { ResizablePanelGroup, ResizablePanel } from "./ui/resizable";
import Display from "./display";
import { selectDisplay, DisplayState } from "@/store/displaySlice";
const AppRoot: React.FC = ({}) => {
  const display: DisplayState = useSelector(selectDisplay);
  return (
    <ResizablePanelGroup direction="horizontal">
      <AppSidebar />
      <ResizablePanel>
        <Display
          direction={display.root.direction ?? "horizontal"}
          components={display.root.components}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
export default AppRoot;
