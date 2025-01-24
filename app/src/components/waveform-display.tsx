"use client";
import { useCallback, useEffect, useRef } from "react";
import { selectPlayback } from "@/store/playback-slice";
import { useSelector } from "react-redux";
import { FileState } from "@/store/project-slice";
interface WaveformDisplayProps {
  media?: FileState;
  channel?: string;
  startPercentage?: number;
  endPercentage?: number;
  crosshair?: boolean;
  width: number;
  height: number;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  media,
  channel = "LR",
  startPercentage = 0,
  endPercentage = 100,
  crosshair = true,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { timeElapsed, loopStart, loopEnd } = useSelector(selectPlayback);
  const drawWaveform = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      if (media && media.summary && canvas) {
        if (!ctx) {
          return;
        }
        console.log("channel cleared");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing

        const { summary } = media;
        if (!summary.mono) {
          return;
        }
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
              left: `${(((timeElapsed / media!.duration) * 100 - startPercentage) / (endPercentage - startPercentage)) * 100}%`,
              width: "2px",
              height: "100%",
              backgroundColor: "blue",
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
        style={{ width: width + "px", height: height + "px" }}
      />
    </div>
  );
};
export default WaveformDisplay;
