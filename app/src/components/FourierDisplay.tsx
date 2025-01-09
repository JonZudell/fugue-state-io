"use client";
import { useEffect, useRef, useState } from "react";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
import {
  colorForBin,
  SummarizedFrame,
  getFrequencyForBin,
  getNoteForFrequency,
} from "../core/waveformSummary";
import { selectFourierScale } from "../store/displaySlice";

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
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const fourierScale = useSelector(selectFourierScale);
  const frequencyRef = useRef<number | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [infoString, setInfoString] = useState<string | null>(null);

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
        const magnitudeIndex = Math.floor((i / pixelsPerMagnitude) / fourierScale);
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

    if (cursorPosition !== null && media && media.summary) {
      const { summary } = media;
      const fourierIndex = Math.min(
        Math.floor(summary.left.length * (timeElapsed / media.duration)),
        summary.left.length - 1,
      );
      const pixelsPerMagnitude =
        canvas.width / summary.left[fourierIndex].magnitudes.length;
      const magnitudeIndex = Math.floor(
        (cursorPosition / pixelsPerMagnitude) / fourierScale,
      );
      if (magnitudeIndex >= 0 && magnitudeIndex < summary.left[fourierIndex].magnitudes.length) {
        const frequency = getFrequencyForBin(magnitudeIndex);
        const closestNote = getNoteForFrequency(frequency);
        setInfoString(`${frequency.toFixed(2)} Hz - ${closestNote}`);
      }
    } else {
      setInfoString(null);
    }
  }, [timeElapsed, channel, media, width, height, crosshair, loopStart, loopEnd, cursorPosition, fourierScale]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    setCursorPosition(x);
    setMouseX(x);
  };

  const handleMouseLeave = () => {
    setCursorPosition(null);
    frequencyRef.current = null;
    setMouseX(null);
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
      {crosshair && mouseX !== null && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${mouseX}px`,
            width: "2px",
            height: "100%",
            backgroundColor: "red",
            zIndex: 100,
            opacity: 1,
          }}
        />
      )}
      {infoString && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: `${mouseX}px`,
            color: "white",
            backgroundColor: "black",
            padding: "2px 5px",
            fontSize: "12px",
            zIndex: 101,
            width: "115px",
            transform: mouseX > canvasRef.current!.width - 115 ? "translateX(-100%)" : "none",
          }}
        >
          {infoString}
        </span>
      )}
    </div>
  );
};
export default FourierDisplay;