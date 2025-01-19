"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppSidebar } from "./app-sidebar";
import { selectLayout, selectOrder } from "@/store/display-slice";
import Display from "./display";
import { useCallback, useEffect, useRef, useState } from "react";
import SummarizeWorker from "@/workers/summarize.worker.js"; // Adjust the import path as necessary
import {
  selectMedia,
  selectMode,
  selectProcessing,
  selectProgress,
  setChannelSummary,
  setLoopEnd,
  setLoopStart,
  setProgress,
} from "@/store/playback-slice";
import FiledropOverlay from "./filedrop-overlay";
import {
  Panel,
  PanelGroup,
  ImperativePanelGroupHandle,
} from "react-resizable-panels";
import { useSidebar } from "./ui/sidebar";
import { Progress } from "./ui/progress";
import PlaybackControls from "./playback-controls";
import Minimap from "./minimap";
import CommandBar from "./CommandBar";

interface AppRootProps {
  setReady: (ready: boolean) => void;
  hidden: boolean;
}

const AppRoot: React.FC<AppRootProps> = ({ setReady, hidden }) => {
  const workerRef = useRef<Worker | null>(null);
  const panelRef = useRef<ImperativePanelGroupHandle>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [panelGroupDimensions, setPanelGroupDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [sidebarDimensions, setSidebarDimensions] = useState({
    width: 0,
    height: 0,
  });
  const order = useSelector(selectOrder);
  const mode = useSelector(selectMode);
  const layout = useSelector(selectLayout);
  const media = useSelector(selectMedia);
  const processing = useSelector(selectProcessing);
  const progress = useSelector(selectProgress);
  const { state } = useSidebar();
  const dispatch = useDispatch();
  const workspaceWidth = panelGroupDimensions.width;
  const menuHeight = 64; // Define menuHeight or replace with appropriate value
  const loopEnd = 0; // Define loopEnd or replace with appropriate value
  const loopStart = 0; // Define loopStart or replace with appropriate value
  const timeElapsed = 0; // Define timeElapsed or replace with appropriate value
  const isDraggingRef = useRef(false); // Define isDraggingRef or replace with appropriate value
  const isPlayingBeforeDragRef = useRef(false); // Define isPlayingBeforeDragRef or replace with appropriate value
  const videoRef = useRef<HTMLVideoElement>(null); // Define videoRef or replace with appropriate value

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
  const handleResize = useCallback(() => {
    if (state === "collapsed") {
      const sidebarWidth = 48;
      setSidebarDimensions({ width: sidebarWidth, height: window.innerHeight });
      setPanelGroupDimensions({
        width: window.innerWidth - sidebarWidth,
        height: window.innerHeight,
      });
    } else {
      const sidebarWidth = 256;
      setSidebarDimensions({ width: sidebarWidth, height: window.innerHeight });
      setPanelGroupDimensions({
        width: window.innerWidth - sidebarWidth,
        height: window.innerHeight,
      });
    }
  }, [state]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);
  useEffect(() => {
    if (state === "collapsed") {
      const sidebarWidth = 48;
      setSidebarDimensions({ width: sidebarWidth, height: window.innerHeight });
      setPanelGroupDimensions({
        width: window.innerWidth - sidebarWidth,
        height: window.innerHeight,
      });
    } else {
      const sidebarWidth = 256;
      setSidebarDimensions({ width: sidebarWidth, height: window.innerHeight });
      setPanelGroupDimensions({
        width: window.innerWidth - sidebarWidth,
        height: window.innerHeight,
      });
    }
  }, [state]);
  return (
    <>
      {media && processing ? (
        <div className="w-full h-full bg-black">
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl text-white">Processing...</h1>
            {progress.map((p, index) => (
              <Progress
                key={index}
                value={p.progress * 100}
                className="w-[60%] m-2"
              />
            ))}
          </div>
        </div>
      ) : (
        !hidden && (
          <PanelGroup
            ref={panelRef}
            direction="horizontal"
            className="w-full h-full"
          >
            <AppSidebar ref={sidebarRef} hidden={!media || processing} />
            {media && !processing && (
              <Panel
                style={{
                  width: panelGroupDimensions.width,
                  height: panelGroupDimensions.height ,
                }}
              >
                <CommandBar workspaceWidth={0} leftMenuWidth={0} />
                <Minimap height={64} width={panelGroupDimensions.width} />
                <Display
                  width={panelGroupDimensions.width}
                  height={panelGroupDimensions.height - menuHeight - 96}
                  layout={layout}
                  order={order}
                />
                <PlaybackControls
                  width={panelGroupDimensions.width}
                  height={menuHeight}
                  enabled={true}
                  loopEnd={loopEnd}
                  setLoopEnd={(end: number) => {
                    dispatch(setLoopEnd(end));
                  }}
                  loopStart={loopStart}
                  setLoopStart={(start: number) => {
                    dispatch(setLoopStart(start));
                  }}
                  timeElapsed={timeElapsed}
                  videoRef={videoRef}
                />
              </Panel>
            )}

            {!media && !processing && workerRef.current && (
              <FiledropOverlay worker={workerRef.current} />
            )}
          </PanelGroup>
        )
      )}
    </>
  );
};
export default AppRoot;
