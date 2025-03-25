"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectPlayback } from "@/store/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { MediaFile, selectProject } from "@/store/project-slice";
import ContextMenuDialog from "./context-menu-dialog";
interface TimelineNotationDisplayProps {
  sourceId: string;
  channel?: string;
  startPercentage?: number;
  endPercentage?: number;
  crosshair?: boolean;
  width: number;
  height: number;
}

const TimelineNotationDisplay: React.FC<TimelineNotationDisplayProps> = ({
  sourceId,
  crosshair = true,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
  }, [
  ]);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: width + "px", height: height + "px" }}
      />
    </div>
  );
};
export default TimelineNotationDisplay;
