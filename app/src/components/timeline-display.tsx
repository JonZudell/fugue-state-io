"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectPlayback, selectProject } from "@/store/project-slice";
import TimelineWaveformDisplay from "./timeline-waveform";
import TimelineNotationDisplay from "./timeline-notation";
interface DisplayProps {
  width: number;
  height: number;
}
const TimelineDisplay: React.FC<DisplayProps> = ({
  width,
  height,
}) => {
  const { mediaFiles, abcs } = useSelector(selectProject);
  const { primarySourceId, timelineDuration } = useSelector(selectPlayback);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return <div style={{ width: `${width}px`, height: `${height}px`, overflowX: "scroll" }}>
    {Object.values(mediaFiles).map((mediaFile, index) => (
      <div key={`${index}-div`} style={{marginLeft: (mediaFile.offset / timelineDuration) * width}}>
        <TimelineWaveformDisplay key={`${index}-timeline`}  width={Math.max(0,(mediaFile.duration / timelineDuration ) * width )} height={height / (Object.keys(mediaFiles).length + Object.keys(abcs).length)} sourceId={mediaFile.id}  />
      </div>
    ))}
    {Object.values(abcs).map((abc, index) => (
      <div key={`${index}-div`} style={{marginLeft: (abc.offset / timelineDuration) * width}}>
        <TimelineNotationDisplay key={`${index}-timeline`}  width={Math.max(0,(abc.duration / timelineDuration ) * width )} height={height / (Object.keys(mediaFiles).length + Object.keys(abcs).length)} sourceId={mediaFile.id}  />
      </div>
    ))}
  </div>;
};

export default TimelineDisplay;
