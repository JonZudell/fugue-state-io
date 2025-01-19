"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playback-slice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
interface WaveformVisualizerProps {
  media?: FileState;
  channel?: string;
  startPercentage?: number;
  endPercentage?: number;
  crosshair?: boolean;
  width: number;
  height: number;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  media,
  channel = "LR",
  startPercentage = 0,
  endPercentage = 100,
  crosshair = true,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const drawWaveform = useCallback(
    (canvas, ctx) => {
      if (media && media.summary && canvas) {
        if (!ctx) {
          return;
        }
        console.log("channel cleared");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing

        const { summary } = media;
        const summaryLength = summary.mono.length;
        const startSample = Math.floor((startPercentage / 100) * summaryLength);
        const endSample = Math.floor((endPercentage / 100) * summaryLength);
        const samplesPerPixel = (endSample - startSample) / canvas.width;
        if (channel === "LR" && summary.left && summary.right) {
          for (let i = 0; i < canvas.width; i++) {
            const startIndex = Math.floor(i * samplesPerPixel + startSample);
            const endIndex =
              Math.floor((i + 1) * samplesPerPixel) + startSample + 1;
            const leftSlice = summary.left.slice(startIndex, endIndex);
            const rightSlice = summary.right.slice(startIndex, endIndex);
            const rightMin = Math.min(...rightSlice.map((frame) => frame.min));
            const rightMax = Math.max(...rightSlice.map((frame) => frame.max));

            const leftMin = Math.min(...leftSlice.map((frame) => frame.min));
            const leftMax = Math.max(...leftSlice.map((frame) => frame.max));
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(
              i,
              canvas.height / 4 - (leftMax * canvas.height) / 4,
              1,
              ((leftMax - leftMin) * canvas.height) / 4,
            );
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(
              i,
              canvas.height / 4 -
                (rightMax * canvas.height) / 4 +
                canvas.height / 2,
              1,
              ((rightMax - rightMin) * canvas.height) / 4,
            );
          }
        } else {
          return;
        }
      }
    },
    [media, startPercentage, endPercentage, channel],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    drawWaveform(canvas, ctx);
  }, [
    drawWaveform,
    timeElapsed,
    channel,
    startPercentage,
    endPercentage,
    media,
    crosshair,
    loopStart,
    loopEnd,
    width,
    height,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: width + "px", height: height + "px" }}
    />
  );
};
export default WaveformVisualizer;
