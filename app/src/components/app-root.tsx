"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppSidebar } from "@/components/app-sidebar";
import { selectDisplay } from "@/store/display-slice";
import Display from "@/components/display";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import SummarizeWorker from "@/workers/summarize.worker.js"; // Adjust the import path as necessary
import { selectPlayback, setChannelSummary } from "@/store/playback-slice";
import { setProgress } from "@/store/project-slice";
import AppInit from "@/components/app-init";
import {
  Panel,
  PanelGroup,
  ImperativePanelGroupHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";
import { useSidebar } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import PlaybackControls from "@/components/playback-controls";
import Minimap from "@/components/minimap-display";
import CommandHeader from "@/components/command-header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import NotationEditor from "@/components/notation-editor";
import {
  selectProject,
  selectAnyProcessing,
  selectProgresses,
  Project,
} from "@/store/project-slice";

interface AppRootProps {
  setReady: (ready: boolean) => void;
  hidden: boolean;
}

const AppRoot: React.FC<AppRootProps> = ({ setReady, hidden }) => {
  const dispatch = useDispatch();
  const commandBarHeight = 48;
  const playbackControlsHeight = 64;
  const minimapHeight = 64;
  const workerRef = useRef<Worker | null>(null);
  const panelRef = useRef<ImperativePanelGroupHandle>(null);
  const topPanelRef = useRef<ImperativePanelHandle>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const progress = useSelector(selectProgresses);
  const processing = useSelector(selectAnyProcessing);

  const { files, abcs } = useSelector(selectProject) as Project;
  const { editor, order, layout } = useSelector(selectDisplay);
  const { mode, media } = useSelector(selectPlayback);
  const { state } = useSidebar();
  const [panelGroupDimensions, setPanelGroupDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [topPanelDimensions, setTopPanelDimensions] = useState({
    width: 0,
    height: 0,
  });

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
              id: event.data.id,
              channel: event.data.channel,
              progress: event.data.progress,
            }),
          );
        } else if (event.data.type === "SUMMARIZED") {
          console.log("Received summary", event.data);
          if (mode === "stereo") {
            dispatch(
              setChannelSummary({
                id: event.data.id,
                summary: event.data.summary,
                channel: event.data.channel,
              }),
            );
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
      setPanelGroupDimensions({
        width: window.innerWidth - sidebarWidth,
        height: window.innerHeight,
      });
    } else {
      const sidebarWidth = 256;
      setPanelGroupDimensions({
        width: window.innerWidth - sidebarWidth,
        height: window.innerHeight,
      });
    }
  }, [state]);

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useLayoutEffect(() => {
    setTopPanelDimensions({
      width: panelGroupDimensions.width,
      height: panelGroupDimensions.height,
    });
  }, [panelGroupDimensions]);

  return (
    <>
      {media && processing ? (
        <div className="w-full h-full bg-black">
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl text-white">Processing...</h1>
            {progress.map((p, index) => (
              <>
                <h2 className="text-white">
                  {files[p.id].name} - {p.channel}
                </h2>
                <Progress
                  key={index}
                  value={p.progress * 100}
                  className="w-[60%] m-2"
                />
              </>
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
                  height: panelGroupDimensions.height,
                }}
              >
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel
                    ref={topPanelRef}
                    onResize={(width, height) => {
                      console.log(
                        `Resized to width: ${width}, height: ${height}`,
                      );
                      setTopPanelDimensions({
                        width: width ?? 0,
                        height: height ?? 0,
                      });
                    }}
                  >
                    <CommandHeader height={commandBarHeight} />
                    <Minimap
                      height={minimapHeight}
                      width={panelGroupDimensions.width}
                    />
                    <Display
                      width={panelGroupDimensions.width}
                      height={
                        (topPanelDimensions.height *
                          panelGroupDimensions.height) /
                          100 -
                        commandBarHeight -
                        minimapHeight -
                        playbackControlsHeight
                      }
                      layout={layout}
                      order={order}
                    />
                    <PlaybackControls
                      width={panelGroupDimensions.width}
                      height={playbackControlsHeight}
                      enabled={true}
                    />
                  </ResizablePanel>
                  {editor && (
                    <>
                      <ResizableHandle withHandle />
                      <ResizablePanel>
                        <NotationEditor
                          width={panelGroupDimensions.width}
                          height={
                            panelGroupDimensions.height -
                            (topPanelDimensions.height *
                              panelGroupDimensions.height) /
                              100
                          }
                        />
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </Panel>
            )}

            {!media && !processing && workerRef.current && (
              <AppInit worker={workerRef.current} />
            )}
          </PanelGroup>
        )
      )}
    </>
  );
};
export default AppRoot;
