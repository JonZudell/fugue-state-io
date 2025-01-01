"use client";
import { useEffect, useRef } from "react";
import { Summary, TreeNode } from "../core/waveformSummary";
import {
  selectLoopEnd,
  selectLooping,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
import { getSlice } from "../core/waveformSummary";
interface MinimapProps {
  media?: FileState;
  width?: number;
  summary?: Summary;
  channel?: string;
  startPercentage?: number;
  endPercentage?: number;
  height?: number;
  displayRatio?: number;
  crosshair?: boolean;
}

const Minimap: React.FC<MinimapProps> = ({
  media,
  channel = "MID",
  startPercentage = 0,
  endPercentage = 100,
  width = 1000,
  height = 200,
  displayRatio = 0.5,
  crosshair = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const looping = useSelector(selectLooping);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full"
      style={{ width: "100%", height: `${displayRatio * 100}%` }}
    ></canvas>
  );
};
export default Minimap;
