"use client";
import { useEffect, useRef, useState } from "react";
import { MediaFile, selectProject } from "@/store/project-slice";
import { selectPlayback } from "@/store/project-slice";
import { selectDisplay } from "@/store/display-slice";
import { useSelector } from "react-redux";
import { SummarizedFrame } from "@/lib/dsp";
interface MinimapProps {
  width: number;
  channel?: string;
  startPercentage?: number;
  endPercentage?: number;
  height: number;
  displayRatio?: number;
  crosshair?: boolean;
}

const Minimap: React.FC<MinimapProps> = ({
  startPercentage = 0,
  endPercentage = 100,
  width,
  height,
  crosshair = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { timeElapsed, loopStart, loopEnd, looping } =
    useSelector(selectPlayback);
  const { mediaFiles } = useSelector(selectProject);
  const { primarySourceId } = useSelector(selectPlayback);
  const [media, setMedia] = useState(mediaFiles[primarySourceId]);

  useEffect(() => {
    setMedia(mediaFiles[primarySourceId]);
  }, [mediaFiles, primarySourceId]);
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
      offset: number = 0,
    ) => {
      for (let i = 0; i < canvas.width; i++) {
        const startIndex = Math.floor(i * samplesPerPixel + startSample);
        const endIndex =
          Math.floor((i + 1) * samplesPerPixel) + startSample + 1;
        const slice = summary.slice(startIndex, endIndex);
        const min = Math.min(...slice.map((frame) => frame.value.min));
        const max = Math.max(...slice.map((frame) => frame.value.max));
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(
          i,
          channelHeight - max * channelHeight + offset,
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
        const summaryLength = summary["L+R"] ? summary["L+R"].length : 0;
        const startSample = 0;
        const endSample = summaryLength;
        const samplesPerPixel = (endSample - startSample) / canvas.width;
        if (media.mode === "L/R" && summary["L"] && summary["R"]) {
          drawChannel(
            ctx,
            canvas,
            summary["L"],
            samplesPerPixel,
            startSample,
            canvas.height / 4,
          );
          drawChannel(
            ctx,
            canvas,
            summary["R"],
            samplesPerPixel,
            startSample,
            canvas.height / 4,
            canvas.height / 2,
          );
        } else if (media.mode === "L+R" && summary["L+R"]) {
          drawChannel(
            ctx,
            canvas,
            summary["L+R"],
            samplesPerPixel,
            startSample,
            canvas.height / 2,
          );
        } else if (media.mode === "L-R" && summary["L-R"]) {
          drawChannel(
            ctx,
            canvas,
            summary["L-R"],
            samplesPerPixel,
            startSample,
            canvas.height / 2,
          );
        } else if (media.mode === "L" && summary["L"]) {
          drawChannel(
            ctx,
            canvas,
            summary["L"],
            samplesPerPixel,
            startSample,
            canvas.height / 2,
          );
        } else if (media.mode === "R" && summary["R"]) {
          drawChannel(
            ctx,
            canvas,
            summary["R"],
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
      {!media ? (
        <div>No media available</div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: `${height}px`,
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
                  backgroundColor: "blue",
                  opacity: 1,
                }}
              />
            )}
          </div>
          {looping && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${loopStart * width}px`,
                width: `${(loopEnd - loopStart) * width}px`,
                height: `100%`,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              }}
            />
          )}
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
      )}
    </>
  );
};
export default Minimap;
