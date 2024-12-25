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
  selectLoopStart,
  selectLoopEnd,
  setLoopEnd,
  setLoopStart,
  selectLooping,
  setMedia,
} from "../store/playbackSlice";
import "./PlaybackArea.css";
interface PlaybackAreaProps {
  focused?: false;
  leftMenuWidth: number;
}

const PlaybackArea: React.FC<PlaybackAreaProps> = ({ leftMenuWidth }) => {
  const dispatch = useDispatch();
  const playing = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const looping = useSelector(selectLooping);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const isPlayingBeforeDragRef = useRef(false);
  const [videoWidth, setVideoWidth] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        setVideoWidth(videoRef.current.clientWidth);
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
  }, [media, videoRef.current?.clientWidth, leftMenuWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && videoRef.current) {
        dispatch(setTimeElapsed(videoRef.current.currentTime));
      } else if (!playing && videoRef.current) {
        videoRef.current.currentTime = timeElapsed;
      }
    }, 50);

    return () => clearInterval(interval);
  }, [playing, dispatch, timeElapsed]);

  useEffect(() => {
    if (media && videoRef.current) {
      dispatch(setMedia(media)); // Dispatch the media object without videoRef
    }
  }, [media, videoRef, dispatch]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeElapsed;
      if (media) {
        dispatch(setMedia(media)); // Dispatch the media object without videoRef
      }
    }
  };

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
                loop={looping}
                onLoadedMetadata={handleLoadedMetadata}
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
                loopEnd={loopEnd}
                setLoopEnd={(end: number) => {
                  dispatch(setLoopEnd(end));
                }}
                loopStart={loopStart}
                setLoopStart={(start: number) => {
                  dispatch(setLoopStart(start));
                }}
                timeElapsed={timeElapsed}
                isDraggingRef={isDraggingRef}
                isPlayingBeforeDragRef={isPlayingBeforeDragRef}
                videoRef={videoRef}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlaybackArea;
