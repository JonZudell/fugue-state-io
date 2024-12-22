"use client";
import CommandBar from "./CommandBar";
import FiledropOverlay from "./FiledropOverlay";
import LeftMenu from "./LeftMenu";
import PlaybackArea from "./PlaybackArea";
import "./Workspace.css";
interface WorkspaceProps {
  focused?: false;
}

const Workspace: React.FC<WorkspaceProps> = ({}) => {
  return (
    <div className={`w-full h-full`}>
      <CommandBar />
      <LeftMenu />
      <PlaybackArea />
      <FiledropOverlay />
    </div>
  );
};
export default Workspace;
