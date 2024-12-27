"use client";
import { useEffect, useRef, useState } from "react";
import PlaybackControls from "./PlaybackControls";
import { useDispatch, useSelector } from "react-redux";
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
  workspaceWidth?: number;
  leftMenuWidth?: number;
}

const PlaybackArea: React.FC<PlaybackAreaProps> = ({
  workspaceWidth,
  leftMenuWidth = 0,
}) => {
  const dispatch = useDispatch();
  const playing = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const looping = useSelector(selectLooping);

  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const isPlayingBeforeDragRef = useRef(false);
  const [activeVideo, setActiveVideo] = useState(1);

  useEffect(() => {
    if (videoRef1.current && videoRef2.current) {
      const activeVideoRef =
        activeVideo === 1 ? videoRef1.current : videoRef2.current;
      if (playing) {
        activeVideoRef.play();
      } else {
        activeVideoRef.pause();
      }
    }
  }, [playing, activeVideo]);

  useEffect(() => {
    const interval = setInterval(() => {
      const activeVideoRef =
        activeVideo === 1 ? videoRef1.current : videoRef2.current;
      const inactiveVideoRef =
        activeVideo === 1 ? videoRef2.current : videoRef1.current;

      if (playing && activeVideoRef) {
        if (
          media &&
          activeVideoRef.currentTime >= loopEnd * media.duration &&
          looping
        ) {
          const newTimeElapsed = loopStart * media.duration;
          inactiveVideoRef?.play();
          activeVideoRef.pause();
          activeVideoRef.currentTime = newTimeElapsed;
          setActiveVideo(activeVideo === 1 ? 2 : 1);
          dispatch(setTimeElapsed(newTimeElapsed));
        } else if (
          media &&
          activeVideoRef.currentTime < loopStart * media.duration &&
          looping
        ) {
          const newTimeElapsed = loopStart * media.duration;
          activeVideoRef.currentTime = newTimeElapsed;
          activeVideoRef.play();
          dispatch(setTimeElapsed(newTimeElapsed));
        } else if (media && activeVideoRef.currentTime >= media.duration) {
          const newTimeElapsed = media.duration;
          activeVideoRef.currentTime = newTimeElapsed;
          activeVideoRef.pause();
        } else {
          dispatch(setTimeElapsed(activeVideoRef.currentTime));
        }
      } else if (!playing && activeVideoRef) {
        activeVideoRef.currentTime = timeElapsed;
      }
    }, 10);

    return () => clearInterval(interval);
  }, [
    playing,
    dispatch,
    timeElapsed,
    media,
    loopEnd,
    looping,
    loopStart,
    activeVideo,
  ]);

  useEffect(() => {
    if (media && videoRef1.current) {
      dispatch(setMedia(media)); // Dispatch the media object without videoRef
    }
  }, [media, videoRef1, dispatch]);

  const handleLoadedMetadata = () => {
    if (videoRef1.current) {
      videoRef1.current.currentTime = timeElapsed;
      if (media) {
        dispatch(setMedia(media)); // Dispatch the media object without videoRef
      }
    }
  };

  return (
    <div className="playbackarea">
      <div className="playbackarea-content" ref={containerRef}>
        <div className="top-content flex flex-col items-center">
          <div
            className="video-container relative"
            style={{ margin: "0 auto" }}
          >
            {media && (
              <>
                <video
                  ref={videoRef1}
                  controls={false}
                  className={`responsive-video ${activeVideo === 1 ? "visible" : "hidden"}`}
                  loop={false} // Disable native looping
                  onLoadedMetadata={handleLoadedMetadata}
                >
                  <source src={media.url} type={media.fileType} />
                  Your browser does not support the video tag.
                </video>
                <video
                  ref={videoRef2}
                  controls={false}
                  className={`responsive-video ${activeVideo === 2 ? "visible" : "hidden"}`}
                  loop={false} // Disable native looping
                  onLoadedMetadata={handleLoadedMetadata}
                >
                  <source src={media.url} type={media.fileType} />
                  Your browser does not support the video tag.
                </video>
              </>
            )}
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
              videoRef={activeVideo === 1 ? videoRef1 : videoRef2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaybackArea;
