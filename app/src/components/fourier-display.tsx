"use client";
import { useEffect, useRef, useState } from "react";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playback-slice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
import {
  colorForBin,
  SummarizedFrame,
  getFrequencyForBin,
  getNoteForFrequency,
} from "@/lib/dsp";

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
  width,
  height,
  crosshair = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const frequencyRef = useRef<number | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [topInfoString, setTopInfoString] = useState<string | null>(null);
  const [bottomInfoString, setBottomInfoString] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
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
        const magnitudeIndex = Math.floor(i / pixelsPerMagnitude);
        const magnitude = Math.log10(
          channel[fourierIndex].magnitudes[magnitudeIndex] + 1,
        );
        const y = channelHeight - magnitude * channelHeight;
        const colors = colorForBin(magnitudeIndex);
        ctx.fillStyle = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, 1)`;
        ctx.fillRect(i, y + offset, 1, magnitude * channelHeight);
      }
    };

    const drawSpectrum = () => {
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
    drawSpectrum();
  }, [
    timeElapsed,
    channel,
    media,
    width,
    height,
    crosshair,
    loopStart,
    loopEnd,
    cursorPosition,
  ]);

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
  const handleMouseEnter = () => {
    setCursorPosition(null);
    frequencyRef.current = null;
  }

  useEffect(() => {
    if (cursorPosition !== null && media && media.summary) {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      if (channel === "LR" && media.summary.left && media.summary.right) {
        const { summary } = media;
        const summaryLength = summary.mono.length;
        const startSample = 0
        const endSample = summaryLength;
        const topSample = Math.floor((cursorPosition / canvas.width) * (endSample - startSample));
        const topBin = Math.floor((cursorPosition / canvas.width) * summary.left[0].magnitudes.length / 8);
        const topFrequency = getFrequencyForBin(topBin, media.sampleRate);
        const topNote = getNoteForFrequency(topFrequency);
        const topMagnitude = summary.left[startSample + topSample].magnitudes[topBin];
        setTopInfoString(`Frequency: ${topFrequency.toFixed(2)}Hz, Note: ${topNote}, Magnitude: ${topMagnitude.toFixed(2)}`);
        const bottomSample = Math.floor((cursorPosition / canvas.width) * (endSample - startSample));
        const bottomBin = Math.floor((cursorPosition / canvas.width) * summary.right[0].magnitudes.length / 8);
        const bottomFrequency = getFrequencyForBin(bottomBin, media.sampleRate);
        const bottomNote = getNoteForFrequency(bottomFrequency);
        const bottomMagnitude = summary.right[startSample + bottomSample].magnitudes[bottomBin];
        setBottomInfoString(`Frequency: ${bottomFrequency.toFixed(2)}Hz, Note: ${bottomNote}, Magnitude: ${bottomMagnitude.toFixed(2)}`);
      } else if (channel === "MID" && media.summary.mono) {
        const { summary } = media;
        const summaryLength = summary.mono.length;
        const startSample = Math.floor((0 / 100) * summaryLength);
        const endSample = Math.floor((100 / 100) * summaryLength);
        const x = cursorPosition;
        const xSample = Math.floor((x / canvas.width) * (endSample - startSample));
        const bin = Math.floor((cursorPosition / canvas.width) * summary.mono[0].magnitudes.length / 8);
        const frequency = getFrequencyForBin(bin, media.sampleRate);
        const note = getNoteForFrequency(frequency);
        const time = (xSample / media.sampleRate).toFixed(2);
        const magnitude = summary.mono[startSample + xSample].magnitudes[bin];
        setTopInfoString(`Time: ${time}s, Frequency: ${frequency.toFixed(2)}Hz, Note: ${note}, Magnitude: ${magnitude.toFixed(2)}`);
      } else if (channel === "SIDE" && media.summary.side) {
        const { summary } = media;
        const summaryLength = summary.side.length;
        const startSample = Math.floor((0 / 100) * summaryLength);
        const endSample = Math.floor((100 / 100) * summaryLength);
        const x = cursorPosition;
        const xSample = Math.floor((x / canvas.width) * (endSample - startSample));
        const bin = Math.floor((cursorPosition / canvas.width) * summary.side[0].magnitudes.length / 8);
        const frequency = getFrequencyForBin(bin, media.sampleRate);
        const note = getNoteForFrequency(frequency);
        const time = (xSample / media.sampleRate).toFixed(2);
        const magnitude = summary.side[startSample + xSample].magnitudes[bin];
        setTopInfoString(`Time: ${time}s, Frequency: ${frequency.toFixed(2)}Hz, Note: ${note}, Magnitude: ${magnitude.toFixed(2)}`);
      }
    } else {
      setTopInfoString(null);
      setBottomInfoString(null);
    }
  }, [cursorPosition, channel, media]);
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
      {mouseX !== null && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${mouseX}px`,
              width: "2px",
              height: "100%",
              backgroundColor: "red",
            }}
          />
          <div
            style={{
            position: "absolute",
            top: "0",
            left: `${mouseX + ((topInfoString?.length || 0) * 10) > width ? mouseX - ((topInfoString?.length || 0) * 10) : mouseX}px`,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "2px 5px",
            width: `${(topInfoString?.length || 0) * 10}px`,
            }}
          >
            <span>{topInfoString}</span>
          </div>
          <div
            style={{
            position: "absolute",
            top: `${height / 2 + "px"}`,
            left: `${mouseX + ((bottomInfoString?.length || 0) * 10) > width ? mouseX - ((bottomInfoString?.length || 0) * 10) : mouseX}px`,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "2px 5px",
            width: `${(bottomInfoString?.length || 0) * 10}px`,
            }}
          >
            <span>{bottomInfoString}</span>
          </div>
        </>
      )}
    </div>
  );
};
export default FourierDisplay;
