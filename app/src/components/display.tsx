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
import { Video } from "lucide-react";
import VideoDisplay from "./video-display";

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
    case "video":
      return <VideoDisplay media={media} width={width} height={height} />;
    default:
      return null;
  }
};

interface DisplayProps {
  node: Node | null;
  width: number;
  height: number;
  parentNodeId: string | null;
  parentDirection?: string;
}
const Display: React.FC<DisplayProps> = ({
  node,
  width,
  height,
  parentNodeId,
  parentDirection,
}) => {
  const { loopStart, loopEnd } = useSelector(selectPlayback);
  if (node === null) {
    return <NullDisplay width={width} height={height} />;
  }
  if (node.type === "waveform") {
    return (
      <WaveformDisplay
        key={node.id}
        nodeId={node.id}
        sourceId={node.sourceId}
        parentNodeId={parentNodeId}
        channel={node.channel}
        startPercentage={loopStart * 100}
        endPercentage={loopEnd * 100}
        width={width}
        height={height}
      />
    );
  }
  if (node.type === "fourier") {
    return (
      <FourierDisplay
        key={node.id}
        nodeId={node.id}
        sourceId={node.sourceId}
        parentNodeId={parentNodeId}
        channel={node.channel}
        startPercentage={loopStart * 100}
        endPercentage={loopEnd * 100}
        width={width}
        height={height}
      />
    );
  }
  if (node.type === "spectrogram") {
    return (
      <SpectrogramDisplay
        key={node.id}
        nodeId={node.id}
        sourceId={node.sourceId}
        parentNodeId={parentNodeId}
        channel={node.channel}
        startPercentage={loopStart * 100}
        endPercentage={loopEnd * 100}
        width={width}
        height={height}
      />
    );
  }
  if (node.type === "video") {
    return (
      <VideoDisplay
        key={node.id}
        nodeId={node.id}
        sourceId={node.sourceId}
        parentNodeId={parentNodeId}
        width={width}
        height={height}
      />
    );
  }
  if (node.type === "notation") {
    return (
      <NotationDisplay
        width={width}
        height={height}
        abcKey={node.sourceId}
        nodeId={node.id}
        sourceId={node.sourceId}
        parentNodeId={parentNodeId}
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
            key={index}
            style={{
              width: `${childWidth}px`,
              height: `${childHeight}px`,
            }}
          >
            <Display
              parentNodeId={node.id}
              parentDirection={node.splitDirection}
              nodeId={child.id}
              node={child}
              width={childWidth}
              height={childHeight}
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
