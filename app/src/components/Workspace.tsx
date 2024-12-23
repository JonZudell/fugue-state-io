"use client";
import { useState } from "react";
import CommandBar from "./CommandBar";
import FiledropOverlay from "./FiledropOverlay";
import LeftMenu from "./LeftMenu";
import PlaybackArea from "./PlaybackArea";
import "./Workspace.css";
interface WorkspaceProps {
  focused?: false;
}

const Workspace: React.FC<WorkspaceProps> = ({}) => {
  const [leftMenuWidth, setLeftMenuWidth] = useState(256);

  return (
    <div className={`w-full h-full`}>
      <CommandBar />
      <LeftMenu onWidthChange={setLeftMenuWidth} />
      <PlaybackArea leftMenuWidth={leftMenuWidth} />
      <FiledropOverlay />
    </div>
  );
};
export default Workspace;
