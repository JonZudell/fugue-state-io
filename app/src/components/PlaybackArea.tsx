"use client";
import { useEffect, useRef, useState } from "react";
import PlaybackControls from "./PlaybackControls";
import { useDispatch, useSelector } from "react-redux";
import { selectFiles } from "../store/filesSlice";
import {
  selectPlaying,
  selectMedia,
  selectTimeElapsed,
  setTimeElapsed,
} from "../store/playbackSlice";
import "./PlaybackArea.css";
interface PlaybackAreaProps {
  focused?: false;
  leftMenuWidth: number;
}

const PlaybackArea: React.FC<PlaybackAreaProps> = ({ leftMenuWidth }) => {
  const files = useSelector(selectFiles);

  const dispatch = useDispatch();
  const playing = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        setVideoWidth(videoRef.current.clientWidth);
      }
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      setVideoWidth(videoRef.current.clientWidth);
    }
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [media, videoRef.current?.clientWidth, leftMenuWidth]);

  return (
    <div className="playbackarea flex">
      <div className="playbackarea-content flex-grow" ref={containerRef}>
        <div className="top-content h-full">
          <div
            className="video-container flex justify-center items-center"
            style={{ zIndex: -1 }}
          >
            {media && (
              <video
                ref={videoRef}
                controls={false}
                className="responsive-video"
              >
                <source src={media.url} type={media.fileType} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          {media && (
            <div
              className="playback-controls absolute bottom-0"
              style={{ width: videoWidth || "100%" }}
            >
              <PlaybackControls
                enabled={media ? true : false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlaybackArea;
