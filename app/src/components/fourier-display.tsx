"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MediaFile, selectProject } from "@/store/project-slice";
import { selectPlayback } from "@/store/project-slice";
import {
  colorForBin,
  SummarizedFrame,
  getFrequencyForBin,
  getNoteForFrequency,
} from "@/lib/dsp";
import ContextMenuDialog from "./context-menu-dialog";

interface FourierDisplayProps {
  width: number;
  channel?: string;
  height: number;
  crosshair?: boolean;
  displayRatioVertical?: number;
  displayRatioHorizontal?: number;
  nodeId: string;
  parentNodeId: string;
  parentDirection: string;
  sourceId: string;
}

const FourierDisplay: React.FC<FourierDisplayProps> = ({
  channel = "L/R",
  width,
  height,
  crosshair = true,
  nodeId,
  parentNodeId,
  parentDirection,
  sourceId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { timeElapsed, loopStart, loopEnd } = useSelector(selectPlayback);
  const project = useSelector(selectProject);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const frequencyRef = useRef<number | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [topInfoString, setTopInfoString] = useState<string | null>(null);
  const [bottomInfoString, setBottomInfoString] = useState<string | null>(null);
  const media = project.mediaFiles[sourceId];

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
        canvas.width / channel[fourierIndex].value.magnitudes.length;
      for (let i = 0; i < canvas.width; i++) {
        const magnitudeIndex = Math.floor(i / pixelsPerMagnitude);
        const magnitude = Math.log10(
          channel[fourierIndex].value.magnitudes[magnitudeIndex] + 1,
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
        if (channel === "L/R" && summary["L"] && summary["R"]) {
          drawFourier(
            ctx,
            canvas,
            summary["L"],
            timeElapsed,
            canvas.height / 2,
          );

          drawFourier(
            ctx,
            canvas,
            summary["L"],
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
        } else if (channel === "L+R" && summary["L+R"]) {
          drawFourier(ctx, canvas, summary["L+R"], timeElapsed, canvas.height);
        } else if (channel === "L-R" && summary["L-R"]) {
          drawFourier(ctx, canvas, summary["L-R"], timeElapsed, canvas.height);
        } else if (channel === "left" && summary["L"]) {
          drawFourier(ctx, canvas, summary["L"], timeElapsed, canvas.height);
        } else if (channel === "right" && summary["R"]) {
          drawFourier(ctx, canvas, summary["R"], timeElapsed, canvas.height);
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
      if (channel === "L/R" && media.summary["L"] && media.summary["R"]) {
        const { summary } = media;
        const summaryLength = summary["L+R"] ? summary["L+R"].length : 0;
        const startSample = 0;
        const endSample = summaryLength;
        const topSample = Math.floor(
          (cursorPosition / canvas.width) * (endSample - startSample),
        );
        const topBin = summary["L"]
          ? Math.floor(
              ((cursorPosition / canvas.width) *
                summary["L"][0].value.magnitudes.length) /
                8,
            )
          : 0;
        const topFrequency = getFrequencyForBin(topBin);
        const topNote = getNoteForFrequency(topFrequency);
        const topMagnitude = summary["L"]
          ? summary["L"][startSample + topSample].value.magnitudes[topBin]
          : 0;
        setTopInfoString(
          `Frequency: ${topFrequency.toFixed(2)}Hz, Note: ${topNote}, Magnitude: ${topMagnitude.toFixed(2)}`,
        );
        const bottomSample = Math.floor(
          (cursorPosition / canvas.width) * (endSample - startSample),
        );
        const bottomBin = summary["R"]
          ? Math.floor(
              ((cursorPosition / canvas.width) *
                summary["R"][0].value.magnitudes.length) /
                8,
            )
          : 0;
        const bottomFrequency = getFrequencyForBin(bottomBin);
        const bottomNote = getNoteForFrequency(bottomFrequency);
        const bottomMagnitude = summary["R"]
          ? summary["R"][startSample + bottomSample].value.magnitudes[bottomBin]
          : 0;
        setBottomInfoString(
          `Frequency: ${bottomFrequency.toFixed(2)}Hz, Note: ${bottomNote}, Magnitude: ${bottomMagnitude.toFixed(2)}`,
        );
      } else if (channel === "mono" && media.summary["L+R"]) {
        const { summary } = media;
        const summaryLength = summary["L+R"] ? summary["L+R"].length : 0;
        const startSample = Math.floor((0 / 100) * summaryLength);
        const endSample = Math.floor((100 / 100) * summaryLength);
        const x = cursorPosition;
        const xSample = Math.floor(
          (x / canvas.width) * (endSample - startSample),
        );
        const bin = summary["L+R"]
          ? Math.floor(
              ((cursorPosition / canvas.width) *
                summary["L+R"][0].value.magnitudes.length) /
                8,
            )
          : 0;
        const frequency = getFrequencyForBin(bin);
        const note = getNoteForFrequency(frequency);
        const time = (xSample / media.sampleRate).toFixed(2);
        const magnitude = summary["L+R"]
          ? summary["L+R"][startSample + xSample].value.magnitudes[bin]
          : 0;
        setTopInfoString(
          `Frequency: ${frequency.toFixed(2)}Hz, Note: ${note}, Magnitude: ${magnitude.toFixed(2)}`,
        );
      } else if (channel === "side" && media.summary["L-R"]) {
        const { summary } = media;
        const summaryLength = summary["L-R"] ? summary["L-R"].length : 0;
        const startSample = Math.floor((0 / 100) * summaryLength);
        const endSample = Math.floor((100 / 100) * summaryLength);
        const x = cursorPosition;
        const xSample = Math.floor(
          (x / canvas.width) * (endSample - startSample),
        );
        const bin = summary["L-R"]
          ? Math.floor(
              ((cursorPosition / canvas.width) *
                summary["L-R"][0].value.magnitudes.length) /
                8,
            )
          : 0;
        const frequency = getFrequencyForBin(bin);
        const note = getNoteForFrequency(frequency);
        const time = (xSample / media.sampleRate).toFixed(2);
        const magnitude = summary["L-R"]
          ? summary["L-R"][startSample + xSample].value.magnitudes[bin]
          : 0;
        setTopInfoString(
          `Frequency: ${frequency.toFixed(2)}Hz, Note: ${note}, Magnitude: ${magnitude.toFixed(2)}`,
        );
      } else if (channel === "left" && media.summary["L"]) {
        const { summary } = media;
        const summaryLength = summary["L"] ? summary["L"].length : 0;
        const startSample = Math.floor((0 / 100) * summaryLength);
        const endSample = Math.floor((100 / 100) * summaryLength);
        const x = cursorPosition;
        const xSample = Math.floor(
          (x / canvas.width) * (endSample - startSample),
        );
        const bin = summary["L"]
          ? Math.floor(
              ((cursorPosition / canvas.width) *
                summary["L"][0].value.magnitudes.length) /
                8,
            )
          : 0;
        const frequency = getFrequencyForBin(bin);
        const note = getNoteForFrequency(frequency);
        const time = (xSample / media.sampleRate).toFixed(2);
        const magnitude = summary["L"]
          ? summary["L"][startSample + xSample].value.magnitudes[bin]
          : 0;
        setTopInfoString(
          `Frequency: ${frequency.toFixed(2)}Hz, Note: ${note}, Magnitude: ${magnitude.toFixed(2)}`,
        );
      } else if (channel === "right" && media.summary["R"]) {
        const { summary } = media;
        const summaryLength = summary["R"] ? summary["L-R"].length : 0;
        const startSample = Math.floor((0 / 100) * summaryLength);
        const endSample = Math.floor((100 / 100) * summaryLength);
        const x = cursorPosition;
        const xSample = Math.floor(
          (x / canvas.width) * (endSample - startSample),
        );
        const bin = summary["R"]
          ? Math.floor(
              ((cursorPosition / canvas.width) *
                summary["R"][0].value.magnitudes.length) /
                8,
            )
          : 0;
        const frequency = getFrequencyForBin(bin);
        const note = getNoteForFrequency(frequency);
        const time = (xSample / media.sampleRate).toFixed(2);
        const magnitude = summary["R"]
          ? summary["R"][startSample + xSample].value.magnitudes[bin]
          : 0;
        setTopInfoString(
          `Frequency: ${frequency.toFixed(2)}Hz, Note: ${note}, Magnitude: ${magnitude.toFixed(2)}`,
        );
      }
    } else {
      setTopInfoString(null);
      setBottomInfoString(null);
    }
  }, [cursorPosition, channel, media]);
  return (
    <ContextMenuDialog
      width={0}
      height={0}
      nodeId={nodeId}
      initialValue={"fourier"}
      parentNodeId={parentNodeId}
      parentDirection={parentDirection}
      mediaKey={sourceId}
      initialChannel={channel}
    >
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
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                left: `${mouseX + (topInfoString?.length || 0) * 10 > width ? mouseX - (topInfoString?.length || 0) * 10 : mouseX}px`,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "2px 5px",
                zIndex: 0,
                width: `${(topInfoString?.length || 0) * 10}px`,
              }}
            >
              <span>{topInfoString}</span>
            </div>
            <div
              style={{
                position: "absolute",
                top: `${height / 2 + "px"}`,
                zIndex: 0,
                left: `${mouseX + (bottomInfoString?.length || 0) * 10 > width ? mouseX - (bottomInfoString?.length || 0) * 10 : mouseX}px`,
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
    </ContextMenuDialog>
  );
};
export default FourierDisplay;
