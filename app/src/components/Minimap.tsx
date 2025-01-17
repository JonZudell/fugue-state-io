"use client";
import { useEffect, useRef } from "react";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
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
  crosshair = true,
  displayRatio = 1,
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

    const drawChannel = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      summary: SummarizedFrame[],
      samplesPerPixel: number,
      startSample: number,
      channelHeight: number,
    ) => {
      for (let i = 0; i < canvas.width; i++) {
        const startIndex = Math.floor(i * samplesPerPixel + startSample);
        const endIndex =
          Math.floor((i + 1) * samplesPerPixel) + startSample + 1;
        const slice = summary.slice(startIndex, endIndex);
        const min = Math.min(...slice.map((frame) => frame.min));
        const max = Math.max(...slice.map((frame) => frame.max));
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(
          i,
          channelHeight - max * channelHeight,
          1,
          (max - min) * channelHeight,
        );
      }
    };

    const drawWaveform = () => {
      if (media && media.summary && canvas) {
        if (!ctx) {
          return;
        }

        const { summary } = media;
        const summaryLength = summary.mono.length;
        const startSample = 0;
        const endSample = summaryLength;
        const samplesPerPixel = (endSample - startSample) / canvas.width;

        if (channel === "LR" && summary.left && summary.right) {
          drawChannel(
            ctx,
            canvas,
            summary.left,
            samplesPerPixel,
            startSample,
            canvas.height / 4,
          );
          drawChannel(
            ctx,
            canvas,
            summary.right,
            samplesPerPixel,
            startSample,
            canvas.height / 4,
          );
        } else if (channel === "MID" && summary.mono) {
          drawChannel(
            ctx,
            canvas,
            summary.mono,
            samplesPerPixel,
            startSample,
            canvas.height / 2,
          );
        } else if (channel === "SIDE" && summary.side) {
          drawChannel(
            ctx,
            canvas,
            summary.side,
            samplesPerPixel,
            startSample,
            canvas.height / 2,
          );
        } else if (channel === "LEFT" && summary.left) {
          drawChannel(
            ctx,
            canvas,
            summary.left,
            samplesPerPixel,
            startSample,
            canvas.height / 2,
          );
        } else if (channel === "RIGHT" && summary.right) {
          drawChannel(
            ctx,
            canvas,
            summary.right,
            samplesPerPixel,
            startSample,
            canvas.height / 2,
          );
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
      <div
        style={{
          position: "relative",
          width: "100%",
          height: `${displayRatio * 100}%`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `100%`,
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
                left: `${(timeElapsed / media!.duration) * 100}%`,
                width: "2px",
                height: `100%`,
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
            width: `${100}%`,
            height: `${100}%`,
          }}
        />
      </div>
    </>
  );
};
export default Minimap;
