"use client";
import { useEffect, useRef } from "react";
import { Summary } from "../core/waveformSummary";
import { selectTimeElapsed } from "@/store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "@/store/filesSlice";
import { getSlice } from "../core/waveformSummary";
import WaveformVisualizer from "./WaveformVisualizer";
interface MinimapProps {
  channel?: string;
  media?: FileState;
  startPercentage?: number;
  endPercentage?: number;
  height?: number;
  width?: number;
  displayRatio?: number;
}

const Minimap: React.FC<MinimapProps> = ({
  channel = "MID",
  media,
  startPercentage = 0,
  endPercentage = 100,
  height = 100,
  width = 1000,
  displayRatio = 0.1,
}) => {
  return (
    <WaveformVisualizer
      height={height}
      width={width}
      displayRatio={displayRatio}
      media={media}
      channel={channel}
    />
  );
};
export default Minimap;
