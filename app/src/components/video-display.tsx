"use client";
import { useEffect, useRef, useState } from "react";
import { selectPlayback } from "@/store/playback-slice";
import { useDispatch, useSelector } from "react-redux";
import { MediaFile, selectProject } from "@/store/project-slice";
import ContextMenuDialog from "./context-menu-dialog";
interface VideoDisplayProps {
  nodeId: string;
  sourceId: string;
  width: number;
  height: number;
  parentNodeId?: string;
  parentDirection?: string;
}
const VideoDisplay: React.FC<VideoDisplayProps> = ({
  nodeId,
  sourceId,
  parentNodeId,
  parentDirection,
  width = 1000,
  height = 200,
}) => {
  const { timeElapsed, playing } = useSelector(selectPlayback);
  const dispatch = useDispatch();
  const project = useSelector(selectProject);
  const media = project.mediaFiles[sourceId];
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("VideoDisplay useEffect");
    const video = videoRef.current;
    if (video) {
      video.currentTime = timeElapsed;
      if (playing) {
        video.play();
      } else {
        video.pause();
      }
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) {
      const video = videoRef.current;
      if (video) {
        video.currentTime = timeElapsed;
      }

    }
  }, [timeElapsed, playing]);

  return (
    <>
      <ContextMenuDialog
        width={0}
        height={0}
        nodeId={nodeId}
        initialValue={"video"}
        parentNodeId={parentNodeId}
        parentDirection={parentDirection}
        mediaKey={sourceId}
      >
        <div
          style={{
            width: width,
            height: height,
            backgroundColor: "black",
            position: "relative",
          }}
        >
          <video
            ref={videoRef}
            src={media?.url}
            controls={false}
            autoPlay={false}
            loop={false}
            muted={true}
          
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </ContextMenuDialog>
    </>
  );
};
export default VideoDisplay;
