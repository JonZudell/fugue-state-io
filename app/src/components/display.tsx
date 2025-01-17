"use client";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Fragment, useRef } from "react";
import CommandBar from "./CommandBar";
import FourierDisplay from "./FourierDisplay";
import SpectrogramDisplay from "./SpectrogramDisplay";
import WaveformVisualizer from "./waveform-visualizer";
import { useSelector } from "react-redux";
import { selectLoopEnd, selectLoopStart, selectMedia } from "@/store/playback-slice";
import { Panel, PanelGroup } from "react-resizable-panels";

interface Display {
  order: string[];
  layout: string;
  width: number;
  height: number;
}

const renderMediaComponent = (
  type: string,
  media: FileState,
  videoRef2: React.RefObject<HTMLVideoElement>,
  loopStart: number,
  loopEnd: number,
  width: number,
  height: number,
  key: string
): JSX.Element | null => {
  switch (type) {
    case "none":
      return (
        <div style={{ width: "100%", height: "100%" }} key={key}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            Display set to None
          </div>
        </div>
      );
    case "video":
      return (
        <video
          ref={videoRef2}
          controls={false}
          className="video-element"
          loop={false}
          style={{
            zIndex: -1,
          }}
          key={key}
        >
          <source src={media.url} type={media.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    case "waveform":
      return (
          <WaveformVisualizer
            key={key}
            media={media}
            startPercentage={loopStart * 100}
            endPercentage={loopEnd * 100}
            width={width}
            height={height}
          />
      );
    case "spectrogram":
      return (<SpectrogramDisplay
            key={key}
            media={media}
            startPercentage={loopStart * 100}
            endPercentage={loopEnd * 100}
          />
      );
    case "fourier":
      return (
          <FourierDisplay key={key} />
      );
    default:
      return null;
  }
};
const Display: React.FC<Display> = ({ order, layout, width, height }) => {
  const media = useSelector(selectMedia);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  return (
    <div style={{ width: width + "px", height: height + "px" }}>
      <CommandBar workspaceWidth={0} leftMenuWidth={0} />
      {layout === "none" && (
        <PanelGroup direction="horizontal" style={{ width: width + "px", height: height + "px" }}>
          <Panel style={{ width: width + "px", height: height + "px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              No Display settings
            </div>
          </Panel>
        </PanelGroup>
      )}
      {layout === "single" && (
        <PanelGroup direction="horizontal" >
          <Panel className="max-h-full h-full">
            {order.map((type, index) => (
              renderMediaComponent(
                type,
                media,
                videoRef2,
                loopStart,
                loopEnd,
                width,
                height,
                `media-${index}`
              )
            ))}
          </Panel>
        </PanelGroup>
      )}
      {layout === "side-by-side" && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              No Display settings
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
      {layout === "stacked" && (
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              No Display settings
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default Display;
