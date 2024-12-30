"use client";
import { useEffect, useRef } from "react";
import { Summary } from "../core/waveformSummary";
import { selectLoopEnd, selectLoopStart, selectTimeElapsed } from "@/store/playbackSlice";
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
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  media,
  channel = "LR",
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

    const drawWaveform = () => {
      console.log("drawing waveform", width, height);
      if (media && media.summary && canvas) {
        if (!ctx) {
          return;
        }
        if (channel === "L") {
          ctx.fillStyle = "white";
          const channelSummary = media.summary.channels.left?.count || 0;
          const startCount = Math.floor(
            (channelSummary * startPercentage) / 100,
          );
          const endCount = Math.floor((channelSummary * endPercentage) / 100);
          const samples = endCount - startCount;
          const samplesPerPixel = samples / canvas.width;
          const data = media.summary.channels.left;
          if (!data) {
            return;
          }
          for (let i = 0; i < canvas.width; i++) {
            const start = startCount + i * samplesPerPixel;
            const end = start + samplesPerPixel;
            const slice = getSlice(data, start, end);
            const yMin = ((1 - slice.low) * canvas.height) / 2;
            const yMax = ((1 - slice.high) * canvas.height) / 2;
            ctx.fillRect(i, yMin, 1, yMax - yMin);
          }
        } else if (channel === "R") {
          ctx.fillStyle = "white";
          const channelSummary = media.summary.channels.right?.count || 0;
          const startCount = Math.floor(
            (channelSummary * startPercentage) / 100,
          );
          const endCount = Math.floor((channelSummary * endPercentage) / 100);
          const samples = endCount - startCount;
          const samplesPerPixel = samples / canvas.width;
          const data = media.summary.channels.right;
          if (!data) {
            return;
          }
          for (let i = 0; i < canvas.width; i++) {
            const start = startCount + i * samplesPerPixel;
            const end = start + samplesPerPixel;
            const slice = getSlice(data, start, end);
            const yMin = ((1 - slice.low) * canvas.height) / 2;
            const yMax = ((1 - slice.high) * canvas.height) / 2;
            ctx.fillRect(i, yMin, 1, yMax - yMin);
          }
        } else if (channel === "MID") {
          ctx.fillStyle = "white";
          const channelSummary = media.summary.channels.mono?.count || 0;
          const startCount = Math.floor(
            (channelSummary * startPercentage) / 100,
          );
          const endCount = Math.floor((channelSummary * endPercentage) / 100);
          const samples = endCount - startCount;
          const samplesPerPixel = samples / canvas.width;
          const data = media.summary.channels.mono;
          if (!data) {
            return;
          }
          for (let i = 0; i < canvas.width; i++) {
            const start = startCount + i * samplesPerPixel;
            const end = start + samplesPerPixel;
            const slice = getSlice(data, start, end);
            const yMin = ((1 - slice.low) * canvas.height) / 2;
            const yMax = ((1 - slice.high) * canvas.height) / 2;
            ctx.fillRect(i, yMin, 1, yMax - yMin);
          }
        } else if (channel === "LR") {
          ctx.fillStyle = "white";
          const channelSummary = media.summary.channels.left?.count || 0;
          const startCount = Math.floor(
            (channelSummary * startPercentage) / 100,
          );
          const endCount = Math.floor((channelSummary * endPercentage) / 100);
          const samples = endCount - startCount;
          const samplesPerPixel = samples / canvas.width;
          const data = media.summary.channels.left;
          if (!data) {
            return;
          }
          for (let i = 0; i < canvas.width; i++) {
            const start = startCount + i * samplesPerPixel;
            const end = start + samplesPerPixel;
            const slice = getSlice(data, start, end);
            const yMin = ((1 - slice.low) * canvas.height) / 4;
            const yMax = ((1 - slice.high) * canvas.height) / 4;
            ctx.fillRect(i, yMin, 1, yMax - yMin);
          }
          const dataRight = media.summary.channels.right;
          if (!dataRight) {
            return;
          }
          for (let i = 0; i < canvas.width; i++) {
            const start = startCount + i * samplesPerPixel;
            const end = start + samplesPerPixel;
            const slice = getSlice(dataRight, start, end);
            const yMin = ((1 - slice.low) * canvas.height) / 4;
            const yMax = ((1 - slice.high) * canvas.height) / 4;
            ctx.fillRect(i, yMin + (canvas.height * 2) / 4, 1, yMax - yMin);
          }
        }
        if (crosshair) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 1;
          const percentFinished = timeElapsed / media.duration;
          const x = (percentFinished - loopStart);
          const diff = loopEnd - loopStart;
          const x2 = x / diff * canvas.width;

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
  }, [timeElapsed, channel, startPercentage, endPercentage, media, width, height, crosshair, loopStart, loopEnd]);

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
export default WaveformVisualizer;
