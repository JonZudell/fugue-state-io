"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import CommandBar from "./CommandBar";
import FiledropOverlay from "./FiledropOverlay";
import PlaybackArea from "./PlaybackArea";
import "./Workspace.css";
import { setControlDown, setEscDown, setKDown } from "../store/commandSlice";
import ShortcutLegend from "./ShortcutLegend";
import LeftMenu from "./LeftMenu";
interface WorkspaceProps {
  focused?: false;
}

const Workspace: React.FC<WorkspaceProps> = ({}) => {
  const dispatch = useDispatch();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [workspaceWidth, setWorkspaceWidth] = useState<number>(0);
  const [leftMenuWidth, setLeftMenuWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (workspaceRef.current) {
      setWorkspaceWidth(workspaceRef.current.offsetWidth);
    }
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        dispatch(setControlDown(true));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        event.preventDefault();
        dispatch(setControlDown(false));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        dispatch(setControlDown(true));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        event.preventDefault();
        dispatch(setControlDown(false));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dispatch(setEscDown(true));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dispatch(setEscDown(false));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k") {
        event.preventDefault();
        dispatch(setKDown(true));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "k") {
        event.preventDefault();
        dispatch(setKDown(false));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  return (
    <div ref={workspaceRef} className={`workspace w-full h-full`}>
      <FiledropOverlay />
      <LeftMenu onWidthChange={setLeftMenuWidth} />
      <CommandBar
        leftMenuWidth={leftMenuWidth}
        workspaceWidth={workspaceWidth}
      />
      <PlaybackArea
        leftMenuWidth={leftMenuWidth}
        workspaceWidth={workspaceWidth}
      />
      <ShortcutLegend leftMenuWidth={leftMenuWidth} />
    </div>
  );
};
export default Workspace;
