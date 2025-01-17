"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppSidebar } from "./app-sidebar";
import { ResizablePanelGroup, ResizablePanel } from "./ui/resizable";
import { selectLayout, selectOrder } from "@/store/display-slice";
import Display from "./display";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import SummarizeWorker from "@/workers/summarize.worker.js"; // Adjust the import path as necessary
import {
  selectMedia,
  selectMode,
  setChannelSummary,
  setProgress,
} from "@/store/playback-slice";
import FiledropOverlay from "./filedrop-overlay";
import { Panel, PanelGroup, ImperativePanelGroupHandle } from "react-resizable-panels";
import { useSidebar } from "./ui/sidebar";

interface AppRootProps {
  setReady: (ready: boolean) => void;
  hidden: boolean;
}

const AppRoot: React.FC<AppRootProps> = ({ setReady, hidden }) => {
  const workerRef = useRef<Worker | null>(null);
  const panelRef = useRef<ImperativePanelGroupHandle>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [panelGroupDimensions, setPanelGroupDimensions] = useState({width: 0, height: 0});
  const [sidebarDimensions, setSidebarDimensions] = useState({width: 0, height: 0});
  const order = useSelector(selectOrder);
  const mode = useSelector(selectMode);
  const layout = useSelector(selectLayout);
  const media = useSelector(selectMedia);
  const {state} = useSidebar();
  const dispatch = useDispatch();

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
      setPanelGroupDimensions({ width: window.innerWidth - sidebarWidth, height: window.innerHeight });
    } else {
      const sidebarWidth = 256;
      setSidebarDimensions({ width: sidebarWidth, height: window.innerHeight });
      setPanelGroupDimensions({ width: window.innerWidth - sidebarWidth, height: window.innerHeight });
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
      setPanelGroupDimensions({ width: window.innerWidth - sidebarWidth, height: window.innerHeight });
    } else {
      const sidebarWidth = 256;
      setSidebarDimensions({ width: sidebarWidth, height: window.innerHeight });
      setPanelGroupDimensions({ width: window.innerWidth - sidebarWidth, height: window.innerHeight });
    }
  }, [state]);
  return (
    <>
      {!hidden && (
        <PanelGroup ref={panelRef} direction="horizontal" className="w-full h-full">
          <AppSidebar ref={sidebarRef} hidden={!media} />
          {media ? (
            <Panel style={{ width: panelGroupDimensions.width, height: panelGroupDimensions.height }}>
              <Display width={panelGroupDimensions.width} height={panelGroupDimensions.height} layout={layout} order={order} />
            </Panel>
          ) : (
            <FiledropOverlay worker={workerRef.current} />
          )}
        </PanelGroup>
      )}
    </>
  );
};
export default AppRoot;
