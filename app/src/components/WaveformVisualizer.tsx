"use client";
import { useEffect, useRef } from "react";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
interface WaveformVisualizerProps {
  media?: FileState;
  width?: number;
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
    <>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            backgroundColor: "rgba(0, 0, 0, 0)",
            overflow: "hidden",
          }}
        >
          {crosshair && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${((timeElapsed / media!.duration) * 100 - startPercentage) / (endPercentage - startPercentage) * 100}%`,
                width: "2px",
                height: "100%",
                backgroundColor: "red",
                zIndex: 100,
                opacity: 1,
              }}
            />
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full"
          style={{
            width: `${displayRatioHorizontal * 100}%`,
            height: `${displayRatioVertical * 100}%`,
          }}
        />
      </div>
    </>
  );
};
export default WaveformVisualizer;
