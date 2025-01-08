"use client";
import { useEffect, useRef } from "react";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
import {
  ABins,
  ASharpBins,
  BBins,
  CBins,
  colorForBin,
  CSharpBins,
  DBins,
  DSharpBins,
  EBins,
  FBins,
  FSharpBins,
  GBins,
  GSharpBins,
  SummarizedFrame,
} from "../core/waveformSummary";

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
        const colors = colorForBin(magnitudeIndex);
        ctx.fillStyle = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 1)`;
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
