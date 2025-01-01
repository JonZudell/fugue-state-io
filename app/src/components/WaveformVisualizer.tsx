"use client";
import { useEffect, useRef } from "react";
import { Summary, TreeNode } from "../core/waveformSummary";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "@/store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "@/store/filesSlice";
import { getSlice } from "../core/waveformSummary";
interface WaveformVisualizerProps {
  media?: FileState;
  width?: number;
  summary?: Summary;
  channel?: string;
  startPercentage?: number;
  endPercentage?: number;
  height?: number;
  displayRatio?: number;
  crosshair?: boolean;
  displayRatioVertical?: number;
  displayRatioHorizontal?: number;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  media,
  channel = "LR",
  startPercentage = 0,
  endPercentage = 100,
  width = 1000,
  height = 200,
  displayRatioVertical = 1,
  displayRatioHorizontal = 1,
  crosshair = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Set canvas width to container width
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight / 2; // Set height to half of container
    }

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawWaveform = () => {
      if (media && media.summary && canvas) {
        if (!ctx) {
          return;
        }
        
        if (crosshair) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 1;
          const percentFinished = timeElapsed / media.duration;
          const x = percentFinished - loopStart;
          const diff = loopEnd - loopStart;
          const x2 = (x / diff) * canvas.width;

          ctx.beginPath();
          ctx.moveTo(x2, 0);
          ctx.lineTo(x2, canvas.height);
          ctx.stroke();
          ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(x2, 0);
          ctx.lineTo(x2, canvas.height);
          ctx.stroke();
        }
      }
    };

    drawWaveform();
  }, [
    timeElapsed,
    channel,
    startPercentage,
    endPercentage,
    media,
    width,
    height,
    crosshair,
    loopStart,
    loopEnd,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full"
      style={{
        width: `${displayRatioHorizontal * 100}%`,
        height: `${displayRatioVertical * 100}%`,
      }}
    ></canvas>
  );
};
export default WaveformVisualizer;
