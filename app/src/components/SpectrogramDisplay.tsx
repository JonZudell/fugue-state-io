"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  selectLoopEnd,
  selectLoopStart,
  selectTimeElapsed,
} from "../store/playbackSlice";
import { useSelector } from "react-redux";
import { FileState } from "../store/filesSlice";
import { colorForBin, getFrequencyForBin, getNoteForFrequency } from "../core/waveformSummary";
import { selectSpectrogramScale } from "../store/displaySlice";
interface SpectrogramDisplayProps {
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

const SpectrogramDisplay: React.FC<SpectrogramDisplayProps> = ({
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
  const [mouseY, setMouseY] = useState<number | null>(null);

  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const spectrogramScale = useSelector(selectSpectrogramScale);
  const [infoString, setInfoString] = useState<string | null>(null);
  const frequencyRef = useRef<number | null>(null);
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMouseY(event.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setMouseY(null);
  };

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
        const binsPerPixel = summary.mono[0].magnitudes.length / canvas.height;
        for (let x = 0; x < canvas.width; x++) {
          for (let y = 0; y < canvas.height; y++) {
            const color = colorForBin(Math.floor((y * binsPerPixel) / 8));
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${summary.mono[Math.floor(x * samplesPerPixel) + startSample].magnitudes[Math.floor((y * binsPerPixel) / spectrogramScale)]})`;
            ctx.fillRect(x, canvas.height - y - 1, 1, 1);
          }
        }
      }
    };

    drawWaveform();
  }, [
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
  
  useEffect(() => {
    const binsPerPixel = media?.summary?.mono[0].magnitudes.length / (canvasRef.current?.height * 2);
    if (binsPerPixel) {
      frequencyRef.current = getFrequencyForBin(Math.floor((canvasRef.current?.height * 2 - mouseY) * binsPerPixel / spectrogramScale));
      const note = getNoteForFrequency(frequencyRef.current);
      setInfoString(`${frequencyRef.current.toFixed(2)}Hz - ${note}`);
    }
  }, [cursorPosition, endPercentage, frequencyRef, height, media, mouseY, setInfoString, startPercentage, timeElapsed, width]);

  return (
    <>
      <div
        style={{ position: "relative", width: "100%", height: "100%" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
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
                backgroundColor: "red",
                zIndex: 100,
                opacity: 1,
              }}
            />
          )}
          {mouseY !== null && (
            <div>
              <div
                style={{
                  position: "absolute",
                  top: `${mouseY}px`,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  backgroundColor: "red",
                  zIndex: 99,
                  opacity: 1,
                }}
              />
                <span
                style={{
                  position: "absolute",
                  top: `${mouseY < 40 ? mouseY + 20 : mouseY - 40}px`,
                  position: "absolute",
                  color: "white",
                  backgroundColor: "black",
                  padding: "2px 5px",
                  fontSize: "12px",
                  zIndex: 101,
                  width: "115px",
                }}
                >
                {infoString}
                </span>
            </div>
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
export default SpectrogramDisplay;
