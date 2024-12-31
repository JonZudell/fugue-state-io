"use client";
import { useEffect, useRef } from "react";
import { Summary } from "../core/waveformSummary";
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
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawSlice = (
      ctx: CanvasRenderingContext2D,
      data: any,
      start: number,
      end: number,
      canvas: HTMLCanvasElement,
      isOutsideLoop: (x: number) => boolean,
    ) => {
      const samplesPerPixel = (end - start) / canvas.width;
      for (let i = 0; i < canvas.width; i++) {
        if (isOutsideLoop(i)) {
          ctx.fillStyle = "#3F3F3F"; // Tailwind green-800 color
        } else {
          ctx.fillStyle = "#A0A0A0"; // Tailwind green-400 color
        }
        const sliceStart = start + i * samplesPerPixel;
        const sliceEnd = sliceStart + samplesPerPixel;
        const slice = getSlice(data, sliceStart, sliceEnd);
        const yMin = ((1 - slice.low) * canvas.height) / 2;
        const yMax = ((1 - slice.high) * canvas.height) / 2;
        ctx.fillRect(i, yMin, 1, yMax - yMin);
      }
    };

    const drawWaveform = () => {
      const loopStartX = loopStart * canvas.width;
      const loopEndX = loopEnd * canvas.width;
      if (looping) {
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.fillStyle = "rgba(128, 128, 128, 0.5)";
        ctx.fillRect(loopStartX, 0, loopEndX - loopStartX, canvas.height);
      }
      if (media && media.summary && canvas) {
        if (!ctx) {
          return;
        }
        const isOutsideLoop = (x: number) => {
          if (!looping) {
            return false;
          }
          const percentage = x / canvas.width;
          return percentage < loopStart || percentage > loopEnd;
        };
        if (channel === "L") {
          const channelSummary = media.summary.channels.left?.count || 0;
          const startCount = 0;
          const endCount = channelSummary;
          const data = media.summary.channels.left;
          if (data) {
            drawSlice(ctx, data, startCount, endCount, canvas, isOutsideLoop);
          }
        } else if (channel === "R") {
          const channelSummary = media.summary.channels.right?.count || 0;
          const startCount = 0;
          const endCount = channelSummary;
          const data = media.summary.channels.right;
          if (data) {
            drawSlice(ctx, data, startCount, endCount, canvas, isOutsideLoop);
          }
        } else if (channel === "MID") {
          const channelSummary = media.summary.channels.mono?.count || 0;
          const startCount = 0;
          const endCount = channelSummary;
          const data = media.summary.channels.mono;
          if (data) {
            drawSlice(ctx, data, startCount, endCount, canvas, isOutsideLoop);
          }
        } else if (channel === "LR") {
          const channelSummary = media.summary.channels.left?.count || 0;
          const startCount = 0;
          const endCount = channelSummary;
          const dataLeft = media.summary.channels.left;
          const dataRight = media.summary.channels.right;
          if (dataLeft) {
            drawSlice(
              ctx,
              dataLeft,
              startCount,
              endCount,
              canvas,
              isOutsideLoop,
            );
          }
          if (dataRight) {
            drawSlice(
              ctx,
              dataRight,
              startCount,
              endCount,
              canvas,
              isOutsideLoop,
            );
          }
        }

        if (crosshair) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 1;
          const x = (timeElapsed / media.duration) * canvas.width;

          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
          ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        if (looping) {
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.lineWidth = 5;
        ctx.strokeRect(loopStartX, 0, loopEndX - loopStartX, canvas.height);
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
    looping,
  ]);

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
