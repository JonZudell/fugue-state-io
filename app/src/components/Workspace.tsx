"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommandBar from "./CommandBar";
import FiledropOverlay from "./FiledropOverlay";
import PlaybackArea from "./PlaybackArea";
import SummarizeWorker from "../workers/summarize.worker.js";
import "./Workspace.css";
import { setControlDown, setEscDown, setKDown } from "../store/commandSlice";
import ShortcutLegend from "./ShortcutLegend";
import LeftMenu from "./LeftMenu";
import {
  selectLooping,
  selectProcessing,
  selectMedia,
  selectMode,
  setChannelSummary,
  setProcessing,
  setProgress,
  selectProgress,
} from "../store/playback-slice";
import { AppSidebar } from "./app-sidebar";
interface WorkspaceProps {
  focused?: false;
}

const Workspace: React.FC<WorkspaceProps> = ({}) => {
  const dispatch = useDispatch();
  const workerRef = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const progess = useSelector(selectProgress);
  const [workspaceWidth, setWorkspaceWidth] = useState<number>(0);
  const [workspaceHeight, setWorkspaceHeight] = useState<number>(0);
  const [leftMenuWidth, setLeftMenuWidth] = useState<number>(60 + 256);
  const looping = useSelector(selectLooping);
  const processing = useSelector(selectProcessing);
  const media = useSelector(selectMedia);
  const mode = useSelector(selectMode);
  useEffect(() => {
    workerRef.current = new SummarizeWorker();
    if (workerRef.current) {
      workerRef.current.onmessage = (event) => {
        if (event.data.type === "READY") {
          setReady(true);
        } else if (event.data.type === "MESSAGE_RECIEVED") {
          console.log("Received message", event.data);
        } else if (event.data.type === "CHANNEL_PROGRESS") {
          console.log("Received progress", event.data);
          dispatch(
            setProgress({
              channel: event.data.channel,
              progress: event.data.progress,
            }),
          );
        } else if (event.data.type === "SUMMARIZED") {
          console.log("Received summary", event.data);
          if (mode === "stereo") {
            dispatch(
              setChannelSummary({
                summary: event.data.summary,
                channel: event.data.channel,
              }),
            );
          } else {
          }
        }
      };
      workerRef.current.postMessage({ type: "CHECK_READY" });
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [workerRef, dispatch, mode]);

  useLayoutEffect(() => {
    const updateWorkspaceDimensions = () => {
      if (workspaceRef.current) {
        setWorkspaceWidth(workspaceRef.current.offsetWidth - leftMenuWidth);
        setWorkspaceHeight(window.innerHeight - 26);
      }
    };

    updateWorkspaceDimensions();

    window.addEventListener("resize", updateWorkspaceDimensions);
    return () => {
      window.removeEventListener("resize", updateWorkspaceDimensions);
    };
  }, [leftMenuWidth, workspaceRef, media, processing]);
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
    <>
      {ready ? (
        <div ref={workspaceRef} className="workspace w-full h-full">
          <FiledropOverlay />
          <CommandBar
            leftMenuWidth={leftMenuWidth}
            workspaceWidth={workspaceWidth}
          />

          {!processing ? (
            <PlaybackArea
              style={{
                position: "absolute",
                top: "26px",
                right: "0px",
                width: `${workspaceWidth}px`,
                height: `${looping ? workspaceHeight - 70 : workspaceHeight - 60}px`,
              }}
              leftMenuWidth={leftMenuWidth}
              workspaceWidth={workspaceWidth}
              workspaceHeight={
                looping ? workspaceHeight - 70 : workspaceHeight - 60
              }
              menuHeight={looping ? 70 : 60}
            />
          ) : (
            <div className="flex flex-col items-center">
              {progess.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    width: `${workspaceWidth * 0.8}px`,
                    margin: "10px 0",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "5px",
                      backgroundColor: "#f0f0f0",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    {entry.channel}
                  </div>
                  <div
                    style={{
                      width: `${entry.progress * workspaceWidth * 0.8}px`,
                      height: "30px",
                      backgroundColor: "#76c7c0",
                      transition: "width 0.5s ease-in-out",
                    }}
                  ></div>
                </div>
              ))}
            </div>
          )}
          <ShortcutLegend />
        </div>
      ) : (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-dashed border-white-900"></div>
        </div>
      )}
    </>
  );
};
export default Workspace;
