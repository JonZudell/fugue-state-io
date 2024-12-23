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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isDraggingRef = useRef(false);
  const [videoWidth, setVideoWidth] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
  const handleTimeElapsedChange = (time: number) => {
    if (!isDraggingRef.current) {
      dispatch(setTimeElapsed(time));
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing, files]);

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleTimeUpdate = () => {
      console.log("time update");
      if (videoElement) {
        dispatch(setTimeElapsed(videoElement.currentTime));
      }
    };

    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  });

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
              style={{ width: containerWidth || "100%" }}
            >
              <PlaybackControls
                enabled={media ? true : false}
                onTimeElapsedChange={handleTimeElapsedChange}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlaybackArea;
