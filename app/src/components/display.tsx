"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectPlayback, setTimeElapsed } from "@/store/playback-slice";
import { Node } from "@/store/display-slice";
import { Panel, PanelGroup } from "react-resizable-panels";
import WaveformDisplay from "@/components/waveform-display";
import SpectrogramDisplay from "@/components/spectrogram-display";
import FourierDisplay from "@/components/fourier-display";
import NotationDisplay from "@/components/notation-display";
import NullDisplay from "./null-display";

const renderMediaComponent = (
  type: string,
  media: any,
  videoRef2: React.RefObject<HTMLVideoElement | null>,
  loopStart: number,
  loopEnd: number,
  width: number,
  height: number,
  key: string,
): JSX.Element | null => {
  switch (type) {
    case "none":
      return (
        <div style={{ width: width, height: height }} key={key}>
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
    case "spectrogram":
      return (
        <SpectrogramDisplay
          key={key}
          media={media}
          startPercentage={loopStart * 100}
          endPercentage={loopEnd * 100}
          width={width}
          height={height}
        />
      );
    case "fourier":
      return (
        <FourierDisplay key={key} media={media} width={width} height={height} />
      );
    case "notation":
      return <NotationDisplay width={width} height={height} />;
    default:
      return null;
  }
};

interface DisplayProps {
  node: Node | null;
  width: number;
  height: number;
}
const Display: React.FC<DisplayProps> = ({ node, width, height }) => {
  const { playing, timeElapsed, loopStart, loopEnd, looping, volume, speed } =
    useSelector(selectPlayback);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  if (node === null) {
    return <NullDisplay width={width} height={height} />;
  }
  if (node.type === "waveform") {
    return (
      <WaveformDisplay
        key={node.id}
        nodeId={node.id}
        sourceId={node.sourceId}
        channel={node.channel}
        startPercentage={loopStart * 100}
        endPercentage={loopEnd * 100}
        width={width}
        height={height}
      />
    );
  }
  // Render the node recursively
  if (node.children && node.children.length > 0) {
    const isHorizontal = node.splitDirection === "horizontal";

    // Divide width and height among children
    const childWidth = isHorizontal ? width / node.children.length : width;
    const childHeight = isHorizontal ? height : height / node.children.length;

    return (
      <PanelGroup
        direction={isHorizontal ? "horizontal" : "vertical"}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {node.children.map((child, index) => (
          <Panel
            key={child.id}
            style={{
              width: `${childWidth}px`,
              height: `${childHeight}px`,
            }}
          >
            <Display
              node={child}
              width={childWidth}
              height={childHeight}
              media={media}
            />
          </Panel>
        ))}
      </PanelGroup>
    );
  }

  // Leaf node: Render media component
  return <div style={{ width: `${width}px`, height: `${height}px` }}>Leaf</div>;
};

export default Display;
