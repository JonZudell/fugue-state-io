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
  uploadFile,
} from "../store/playbackSlice";
import { selectDisplayMode, selectLayout, setDisplayMode } from "../store/displaySlice";
import "./PlaybackArea.css";
import WaveformVisualizer from "./WaveformVisualizer";
import { AppDispatch } from "../store";
import Minimap from "./Minimap";
interface PlaybackAreaProps {
  focused?: false;
  workspaceWidth: number;
  workspaceHeight: number;
  style: React.CSSProperties;
  leftMenuWidth: number;
  menuHeight: number;
}

const displayModeTemplateVideoWaveform = {
  "minimap": 0.1,
  "video": .45,
  "waveform": .45,
};

const displayModeTemplateWaveform = {
  "minimap": 0.1,
  "video": 0,
  "waveform": 0.9,
};

const displayModeTemplateVideo = {
  "minimap": 0.1,
  "video": 0.9,
  "waveform": 0,
};

const PlaybackArea: React.FC<PlaybackAreaProps> = ({
  workspaceHeight,
  workspaceWidth,
  style,
  menuHeight
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const playing = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const looping = useSelector(selectLooping);
  const displayMode = useSelector(selectDisplayMode);
  const [displayRatios, setDisplayRatios] = useState(displayModeTemplateVideoWaveform);

  const isDraggingRef = useRef(false);
  const isPlayingBeforeDragRef = useRef(false);
  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeVideo, setActiveVideo] = useState(1);

  useEffect(() => {
    if (displayMode === "waveform-video") {
      setDisplayRatios(displayModeTemplateVideoWaveform);
    } else if (displayMode === "waveform") {
      setDisplayRatios(displayModeTemplateWaveform);
    } else if (displayMode === "video") {
      setDisplayRatios(displayModeTemplateVideo);
    } else {
      setDisplayRatios(displayModeTemplateWaveform);
    }
  }, [displayMode]);

  useEffect(() => {
    if (media) {
      if (media.fileType.startsWith("video")) {
        dispatch(setDisplayMode("waveform-video"));
      } else {
        dispatch(setDisplayMode("waveform"));
      }
    }
}, [dispatch, media])

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
      if (media) {
        dispatch(uploadFile(media)); // Dispatch the media object without videoRef
      }
    }
  }, [media, videoRef1, dispatch]);

  return (
    <div className="playbackarea" ref={containerRef} style={style}>
      {media && (
        <Minimap
          media={media}
          height={workspaceHeight / 10}
          width={workspaceWidth}
          displayRatio={1 / 10}
          startPercentage={loopStart * 100}
          endPercentage={loopEnd * 100}
        ></Minimap>
      )}
      <div className="video-container">
        {media && displayRatios['video'] > 0 && (
          <div className="video-wrapper flex">
            <video
              ref={videoRef1}
              controls={false}
              className={`video-element ${activeVideo === 1 ? "visible" : "hidden"}`}
              loop={false}
              style={{
                maxHeight: `${workspaceHeight  * displayRatios['video']}px`,
                maxWidth: `${workspaceWidth}px`,
                width: `${workspaceWidth}px`,
                height: `${workspaceHeight * displayRatios['video']}px`,
                zIndex: -1,
              }}
            >
              <source src={media.url} type={media.fileType} />
              Your browser does not support the video tag.
            </video>
            <video
              ref={videoRef2}
              controls={false}
              className={`video-element ${activeVideo === 2 ? "visible" : "hidden"}`}
              loop={false}
              style={{
                maxHeight: `${workspaceHeight * displayRatios['video']}px`,
                maxWidth: `${workspaceWidth}px`,
                width: `${workspaceWidth}px`,
                height: `${workspaceHeight * displayRatios['video']}px`,
                zIndex: -1,
              }}
            >
              <source src={media.url} type={media.fileType} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
      {media && displayRatios['waveform'] > 0 && (
        <WaveformVisualizer
          media={media}
          startPercentage={loopStart * 100}
          endPercentage={loopEnd * 100}
          width={workspaceWidth}
          height={workspaceHeight * displayRatios['waveform']}
          displayRatio={displayRatios['waveform']}
        />
      )}
      {media && (
        <PlaybackControls
          width={workspaceWidth}
          height={menuHeight}
          enabled={true}
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
          className="absolute bottom-0 left-0 right-0"
        />
      )}
      {!media && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2>New Project!</h2>
            <h3>Upload media to get started</h3>
          </div>
        </div>
      )}
    </div>
  );
};
export default PlaybackArea;
