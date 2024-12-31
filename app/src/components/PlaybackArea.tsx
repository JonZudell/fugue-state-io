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
import {
  selectZoomStart,
  selectZoomEnd,
  selectLayout,
  selectMinimap,
  selectOrder,
  selectLayoutRatios,
} from "../store/displaySlice";
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

const miniMapEnabled = {
  minimap: 0.1,
  remainder: 0.9,
};

const miniMapDisabled = {
  minimap: 0,
  remainder: 1,
};

const PlaybackArea: React.FC<PlaybackAreaProps> = ({
  workspaceHeight,
  workspaceWidth,
  style,
  menuHeight,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const playing = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const looping = useSelector(selectLooping);
  const zoomStart = useSelector(selectZoomStart);
  const zoomEnd = useSelector(selectZoomEnd);
  const layout = useSelector(selectLayout);
  const minimap = useSelector(selectMinimap);
  const order = useSelector(selectOrder);

  const [minimapRatios, setMinimapRatios] = useState(
    minimap ? miniMapEnabled : miniMapDisabled,
  );

  const isDraggingRef = useRef(false);
  const isPlayingBeforeDragRef = useRef(false);
  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeVideo, setActiveVideo] = useState(1);

  useEffect(() => {
    if (minimap) {
      setMinimapRatios(miniMapEnabled);
    } else {
      setMinimapRatios(miniMapDisabled);
    }
  }, [minimap]);

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
    <div className={`playback`} ref={containerRef} style={style}>
      {media && minimap && (
        <Minimap
          media={media}
          height={workspaceHeight * minimapRatios["minimap"]}
          width={workspaceWidth}
          displayRatio={minimapRatios["minimap"]}
          startPercentage={loopStart}
          endPercentage={loopEnd}
        ></Minimap>
      )}

      {media && layout === "single" && (
        <>
          {order.includes("video") && (
            <div className="video-wrapper">
              <video
                ref={videoRef1}
                controls={false}
                className={`video-element ${activeVideo === 1 ? "visible" : "hidden"}`}
                loop={false}
                style={{
                  maxWidth: `${workspaceWidth}px`,
                  width: `${workspaceWidth}px`,
                  maxHeight: `${workspaceHeight * minimapRatios["remainder"]}px`,
                  height: `${workspaceHeight * minimapRatios["remainder"]}px`,
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
                  maxWidth: `${workspaceWidth}px`,
                  width: `${workspaceWidth}px`,
                  maxHeight: `${workspaceHeight * minimapRatios["remainder"]}px`,
                  height: `${workspaceHeight * minimapRatios["remainder"]}px`,
                  zIndex: -1,
                }}
              >
                <source src={media.url} type={media.fileType} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {order.includes("waveform") && (
            <WaveformVisualizer
              media={media}
              startPercentage={loopStart * 100}
              endPercentage={loopEnd * 100}
              width={workspaceWidth}
              height={workspaceHeight}
              displayRatioVertical={minimapRatios["remainder"]}
              displayRatioHorizontal={1}
            />)}
        </>
      )}
      {media && layout === "side-by-side" && (
        <>
          {order.map((item, index) => {
            return (
                <div
                key={index}
                className=""

                >
                {item === "video" && (
                  <video
                  ref={videoRef1}
                  controls={false}
                  className={`video-element ${activeVideo === 1 ? "visible" : "hidden"}`}
                  loop={false}
                  style={{
                    maxWidth: `${workspaceWidth * 0.5}px`,
                    width: `${workspaceWidth * 0.5}px`,
                    maxHeight: `${workspaceHeight * minimapRatios.remainder}px`,
                    height: `${workspaceHeight * minimapRatios.remainder}px`,
                    zIndex: -1,
                  }}
                  >
                  <source src={media.url} type={media.fileType} />
                  Your browser does not support the video tag.
                  </video>
                )}
                {item === "waveform" && (
                  <div className="waveform-wrapper"
                  style={{
                    maxWidth: `${workspaceWidth * 0.5}px`,
                    width: `${workspaceWidth * 0.5}px`,
                    maxHeight: `${workspaceHeight * minimapRatios.remainder}px`,
                    height: `${workspaceHeight * minimapRatios.remainder}px`,
                    }}>
                    <WaveformVisualizer
                    media={media}
                    startPercentage={loopStart * 100}
                    endPercentage={loopEnd * 100}
                    width={workspaceWidth * 0.5}
                    height={workspaceHeight}
                    displayRatioVertical={1}
                    displayRatioHorizontal={1}
                    />
                  </div>
                )}
                </div>
            );
          })}
        </>
      )}
      {media && layout === "stacked" && (
        <>
        </>
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
      {media ? (
        order.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2>No Display Settings!</h2>
              <h3>Choose display setting to get started</h3>
            </div>
          </div>
        )
      ) : (
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
