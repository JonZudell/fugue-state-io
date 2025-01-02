"use client";
import { useEffect, useRef } from "react";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
import { ABins,
  ASharpBins,
  BBins,
  CBins,
  CSharpBins,
  DBins,
  DSharpBins,
  EBins,
  FBins,
  FSharpBins,
  GBins,
  GSharpBins, SummarizedFrame } from "../core/waveformSummary";

interface FourierDisplayProps {
  media?: FileState;
  width?: number;
  channel?: string;
  height?: number;
  crosshair?: boolean;
  displayRatioVertical?: number;
  displayRatioHorizontal?: number;
}

const FourierDisplay: React.FC<FourierDisplayProps> = ({
  media,
  channel = "LR",
  width = 1000,
  height = 1000,
  crosshair = true,
  displayRatioVertical = 1,
  displayRatioHorizontal = 1,
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
  }, [
    timeElapsed,
    channel,
    media,
    width,
    height,
    crosshair,
    loopStart,
    loopEnd,
  ]);

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

    const drawFourier = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      channel: SummarizedFrame[],
      timeElapsed: number,
      channelHeight: number,
      offset: number = 0,
    ) => {
      if (!media) {
        return;
      }
      const fourierIndex = Math.min(
        Math.floor(channel.length * (timeElapsed / media.duration)),
        channel.length - 1,
      );
      const pixelsPerMagnitude =
        canvas.width / channel[fourierIndex].magnitudes.length;
      for (let i = 0; i < canvas.width; i++) {
        const magnitudeIndex = Math.floor((i / pixelsPerMagnitude) * 0.125);
        console.log(magnitudeIndex);
        const magnitude = Math.log10(
          channel[fourierIndex].magnitudes[magnitudeIndex] + 1,
        );
        const y = channelHeight - magnitude * channelHeight;
        
        if (CBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(239 68 68)"; // red-500
        } else if (CSharpBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(107 114 128)"; // gray-500
        } else if (DBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(249 115 22)"; // orange-500
        } else if (DSharpBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(107 114 128)"; // gray-500
        } else if (EBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(234 179 8)"; // yellow-500
        } else if (FBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(34 197 94)"; // green-500
        } else if (FSharpBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(107 114 128)"; // gray-500
        } else if (GBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(59 130 246)"; // blue-500
        } else if (GSharpBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(107 114 128)"; // gray-500
        } else if (ABins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(79 70 229)"; // indigo-500
        } else if (ASharpBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(107 114 128)"; // gray-500
        } else if (BBins.includes(magnitudeIndex)) {
          ctx.fillStyle = "rgb(139 92 246)"; // violet-500
        } else {
          ctx.fillStyle = "rgb(156 163 175)"; // gray-400
        }
        ctx.fillRect(i, y + offset, 1, magnitude * channelHeight);
      }
    };

    const drawWaveform = () => {
      if (media && media.summary && canvas) {
        if (!ctx) {
          return;
        }

        const { summary } = media;

        if (channel === "LR" && summary.left && summary.right) {
          drawFourier(
            ctx,
            canvas,
            summary.left,
            timeElapsed,
            canvas.height / 2,
          );

          drawFourier(
            ctx,
            canvas,
            summary.right,
            timeElapsed,
            canvas.height / 2,
            canvas.height / 2,
          );
          // Draw line splitting channels horizontally
          ctx.strokeStyle = "gray";
          ctx.beginPath();
          ctx.moveTo(0, canvas.height / 2);
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        } else if (channel === "MID" && summary.mono) {
          drawFourier(
            ctx,
            canvas,
            summary.mono,
            timeElapsed,
            canvas.height / 2,
          );
        } else if (channel === "SIDE" && summary.side) {
          drawFourier(
            ctx,
            canvas,
            summary.side,
            timeElapsed,
            canvas.height / 2,
          );
        } else if (channel === "LEFT" && summary.left) {
          drawFourier(
            ctx,
            canvas,
            summary.left,
            timeElapsed,
            canvas.height / 2,
          );
        } else if (channel === "RIGHT" && summary.right) {
          drawFourier(
            ctx,
            canvas,
            summary.right,
            timeElapsed,
            canvas.height / 2,
          );
        }
      }
    };

    drawWaveform();
  }, [
    timeElapsed,
    channel,
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
export default FourierDisplay;
