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
  displayRatioVertical = 0.5,
  displayRatioHorizontal = 0.5,
  crosshair = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);

  const drawSlice = (
    ctx: CanvasRenderingContext2D,
    data: TreeNode,
    startCount: number,
    endCount: number,
    canvas: HTMLCanvasElement,
    channel: string,
    channels: number,
  ) => {
    ctx.fillStyle = "#A0A0A0";
    const samples = endCount - startCount;
    const samplesPerPixel = samples / canvas.width;
    for (let i = 0; i < canvas.width; i++) {
      if (channels === 2) {
        if (channel === "L") {
          const start = startCount + i * samplesPerPixel;
          const end = start + samplesPerPixel;
          const slice = getSlice(data, start, end);
          const yMin = ((1 - slice.low) * canvas.height) / 4;
          const yMax = ((1 - slice.high) * canvas.height) / 4;
          ctx.fillRect(i, yMin, 1, yMax - yMin);
        }
        if (channel === "R") {
          const start = startCount + i * samplesPerPixel;
          const end = start + samplesPerPixel;
          const slice = getSlice(data, start, end);
          const yMin = ((1 - slice.low) * canvas.height) / 4;
          const yMax = ((1 - slice.high) * canvas.height) / 4;
          ctx.fillRect(i, yMin + canvas.height / 2, 1, yMax - yMin);
        }
      } else {
        const start = startCount + i * samplesPerPixel;
        const end = start + samplesPerPixel;
        const slice = getSlice(data, start, end);
        const yMin = ((1 - slice.low) * canvas.height) / 2;
        const yMax = ((1 - slice.high) * canvas.height) / 2;
        ctx.fillRect(i, yMin, 1, yMax - yMin);
      }
    }
  };

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
        if (channel === "L") {
          const channelSummary = media.summary.channels.left?.count || 0;
          const startCount = Math.floor(
            (channelSummary * startPercentage) / 100,
          );
          const endCount = Math.floor((channelSummary * endPercentage) / 100);
          const data = media.summary.channels.left;
          if (!data) {
            return;
          }
          drawSlice(ctx, data, startCount, endCount, canvas, channel, 1);
        } else if (channel === "R") {
          const channelSummary = media.summary.channels.right?.count || 0;
          const startCount = Math.floor(
            (channelSummary * startPercentage) / 100,
          );
          const endCount = Math.floor((channelSummary * endPercentage) / 100);
          const data = media.summary.channels.right;
          if (!data) {
            return;
          }
          drawSlice(ctx, data, startCount, endCount, canvas, channel, 1);
        } else if (channel === "MID") {
          const channelSummary = media.summary.channels.mono?.count || 0;
          const startCount = Math.floor(
            (channelSummary * startPercentage) / 100,
          );
          const endCount = Math.floor((channelSummary * endPercentage) / 100);
          const data = media.summary.channels.mono;
          if (!data) {
            return;
          }
          drawSlice(ctx, data, startCount, endCount, canvas, channel, 1);
        } else if (channel === "LR") {
          const channelSummary = media.summary.channels.left?.count || 0;
          const startCount = Math.floor(
            (channelSummary * startPercentage) / 100,
          );
          const endCount = Math.floor((channelSummary * endPercentage) / 100);
          if (media.summary.channels.left) {
            drawSlice(
              ctx,
              media.summary.channels.left,
              startCount,
              endCount,
              canvas,
              "L",
              2,
            );
          }
          if (media.summary.channels.right) {
            drawSlice(
              ctx,
              media.summary.channels.right,
              startCount,
              endCount,
              canvas,
              "R",
              2,
            );
          }
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
