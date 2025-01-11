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
  selectVolume,
  selectSpeed,
} from "../store/playbackSlice";
import {
  selectLayout,
  selectMinimap,
  selectOrder,
} from "../store/displaySlice";
import "./PlaybackArea.css";
import WaveformVisualizer from "./WaveformVisualizer";
import { AppDispatch } from "../store";
import Minimap from "./Minimap";
import FourierDisplay from "./FourierDisplay";
import SpectrogramDisplay from "./SpectrogramDisplay";
import { FileState } from "../store/filesSlice";
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

const renderMediaComponent = (
  type: string,
  media: FileState,
  videoRef2: React.RefObject<HTMLVideoElement>,
  workspaceWidth: number,
  workspaceHeight: number,
  minimapRatios: { minimap: number; remainder: number },
  loopStart: number,
  loopEnd: number,
) => {
  switch (type) {
    case "video":
      return (
        <video
          ref={videoRef2}
          controls={false}
          className="video-element"
          loop={false}
          style={{
            maxWidth: `${workspaceWidth}px`,
            width: `${workspaceWidth}px`,
            maxHeight: `${workspaceHeight * minimapRatios.remainder}px`,
            height: `${workspaceHeight * minimapRatios.remainder}px`,
            zIndex: -1,
          }}
        >
          <source src={media.url} type={media.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    case "waveform":
      return (
        <div
          className="waveform-wrapper"
          style={{
            maxWidth: `${workspaceWidth}px`,
            width: `${workspaceWidth}px`,
            maxHeight: `${workspaceHeight * minimapRatios.remainder}px`,
            height: `${workspaceHeight * minimapRatios.remainder}px`,
          }}
        >
          <WaveformVisualizer
            media={media}
            startPercentage={loopStart * 100}
            endPercentage={loopEnd * 100}
            width={workspaceWidth}
            height={workspaceHeight}
            displayRatioVertical={1}
            displayRatioHorizontal={1}
          />
        </div>
      );
    case "spectrogram":
      return (
        <div
          className="spectrogram-wrapper"
          style={{
            maxWidth: `${workspaceWidth}px`,
            width: `${workspaceWidth}px`,
            maxHeight: `${workspaceHeight * minimapRatios.remainder}px`,
            height: `${workspaceHeight * minimapRatios.remainder}px`,
          }}
        >
          <SpectrogramDisplay
            media={media}
            startPercentage={loopStart * 100}
            endPercentage={loopEnd * 100}
            width={workspaceWidth}
            height={workspaceHeight}
            displayRatioVertical={1}
            displayRatioHorizontal={1}
          />
        </div>
      );
    case "fourier":
      return (
        <div
          className="fourier-wrapper"
          style={{
            maxWidth: `${workspaceWidth}px`,
            width: `${workspaceWidth}px`,
            maxHeight: `${workspaceHeight * minimapRatios.remainder}px`,
            height: `${workspaceHeight * minimapRatios.remainder}px`,
          }}
        >
          <FourierDisplay
            media={media}
            width={workspaceWidth}
            height={workspaceHeight}
            displayRatioVertical={1}
            displayRatioHorizontal={1}
          />
        </div>
      );
    default:
      return null;
  }
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
  const layout = useSelector(selectLayout);
  const minimap = useSelector(selectMinimap);
  const order = useSelector(selectOrder);
  const volume = useSelector(selectVolume);
  const speed = useSelector(selectSpeed);
  const [minimapRatios, setMinimapRatios] = useState(
    minimap ? miniMapEnabled : miniMapDisabled,
  );

  const isDraggingRef = useRef(false);
  const isPlayingBeforeDragRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (minimap) {
      setMinimapRatios(miniMapEnabled);
    } else {
      setMinimapRatios(miniMapDisabled);
    }
  }, [minimap]);

  useEffect(() => {
    if (videoRef.current) {
      const volumeLogScale = Math.log10(volume + 1) / 2; // Scale volume logarithmically
      videoRef.current.volume = volumeLogScale;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      if (videoRef2.current) {
        videoRef2.current.playbackRate = speed;
      }
    }
  }, [speed]);

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play();
        if (videoRef2.current) {
          videoRef2.current.volume = 0;
          videoRef2.current.play();
        }
      } else {
        videoRef.current.pause();
        if (videoRef2.current) {
          videoRef2.current.play();
        }
      }
    }
  }, [playing]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && videoRef.current) {
        if (
          media &&
          videoRef.current.currentTime >= loopEnd * media.duration &&
          looping
        ) {
          const newTimeElapsed = loopStart * media.duration;
          videoRef.current.currentTime = newTimeElapsed;
          videoRef.current.play();
          if (videoRef2.current) {
            videoRef2.current.volume = 0;
            videoRef2.current.currentTime = newTimeElapsed;
            videoRef2.current.play();
          }
          dispatch(setTimeElapsed(newTimeElapsed));
        } else if (
          media &&
          videoRef.current.currentTime < loopStart * media.duration &&
          looping
        ) {
          const newTimeElapsed = loopStart * media.duration;
          videoRef.current.currentTime = newTimeElapsed;
          videoRef.current.play();
          if (videoRef2.current) {
            videoRef2.current.volume = 0;
            videoRef2.current.currentTime = newTimeElapsed;
            videoRef2.current.play();
          }
          dispatch(setTimeElapsed(newTimeElapsed));
        } else if (media && videoRef.current.currentTime >= media.duration) {
          const newTimeElapsed = media.duration;
          videoRef.current.currentTime = newTimeElapsed;
          videoRef.current.pause();
          if (videoRef2.current) {
            videoRef2.current.volume = 0;
            videoRef2.current.currentTime = newTimeElapsed;
            videoRef2.current.pause();
          }
        } else {
          dispatch(setTimeElapsed(videoRef.current.currentTime));
        }
      } else if (!playing && videoRef.current) {
        videoRef.current.currentTime = timeElapsed;
        if (videoRef2.current) {
          videoRef2.current.currentTime = timeElapsed;
        }
      }
    }, 10);

    return () => clearInterval(interval);
  }, [playing, dispatch, timeElapsed, media, loopEnd, looping, loopStart]);

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
      {media && (
        <video
          ref={videoRef}
          controls={false}
          className="video-element"
          loop={false}
          style={{
            display: "none",
          }}
        >
          <source src={media.url} type={media.fileType} />
          Your browser does not support the video tag.
        </video>
      )}
      {media && layout === "single" && (
        <>
          {order.map((item, index) => (
            <div key={index} className="media-wrapper">
              {renderMediaComponent(
                item,
                media,
                videoRef2,
                workspaceWidth,
                workspaceHeight,
                minimapRatios,
                loopStart,
                loopEnd,
              )}
            </div>
          ))}
        </>
      )}
      {media && layout === "side-by-side" && (
        <div
          className={"display-area-side-by-side"}
          style={{
            height: workspaceHeight * minimapRatios["remainder"],
            width: workspaceWidth,
          }}
        >
          {order.map((item, index) => {
            return (
              <div key={index} className="display-area-side-by-side">
                {renderMediaComponent(
                  item,
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
            );
          })}
        </div>
      )}
      {media && layout === "stacked" && (
        <div
          style={{
            height: workspaceHeight * minimapRatios["remainder"],
            width: workspaceWidth,
          }}
        >
          {order.map((item, index) => {
            return (
              <div key={index}>
                {renderMediaComponent(
                  item,
                  media,
                  videoRef2,
                  workspaceWidth,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
            );
          })}
        </div>
      )}
      {media && layout === "stacked-bottom-side-by-side" && (
        <div
          style={{
            height: workspaceHeight * minimapRatios["remainder"],
            width: workspaceWidth,
          }}
        >
          <div className="display-area-stacked-top">
            {renderMediaComponent(
              order[0],
              media,
              videoRef2,
              workspaceWidth,
              workspaceHeight * 0.5,
              minimapRatios,
              loopStart,
              loopEnd,
            )}
          </div>
          <div className="display-area-stacked-bottom">
            <div className="display-area-side-by-side">
              <div className="display-area-side-by-side-left">
                {renderMediaComponent(
                  order[1],
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
              <div className="display-area-side-by-side-left">
                {renderMediaComponent(
                  order[2],
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {media && layout === "stacked-top-side-by-side" && (
        <div
          style={{
            height: workspaceHeight * minimapRatios["remainder"],
            width: workspaceWidth,
          }}
        >
          <div className="display-area-stacked-bottom">
            <div className="display-area-side-by-side">
              <div className="display-area-side-by-side-left">
                {renderMediaComponent(
                  order[0],
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
              <div className="display-area-side-by-side-left">
                {renderMediaComponent(
                  order[1],
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
            </div>
          </div>
          <div className="display-area-stacked-top">
            {renderMediaComponent(
              order[2],
              media,
              videoRef2,
              workspaceWidth,
              workspaceHeight * 0.5,
              minimapRatios,
              loopStart,
              loopEnd,
            )}
          </div>
        </div>
      )}
      {media && layout === "side-by-side-left-stacked" && (
        <div
          className={"display-area-side-by-side"}
          style={{
            height: workspaceHeight * minimapRatios["remainder"],
            width: workspaceWidth,
          }}
        >
          <div className={"display-area-side-by-side-right"}>
            <div className={"display-area-side-by-side-right-stacked-top"}>
              {renderMediaComponent(
                order[0],
                media,
                videoRef2,
                workspaceWidth * 0.5,
                workspaceHeight * 0.5,
                minimapRatios,
                loopStart,
                loopEnd,
              )}
            </div>
            <div className={"display-area-side-by-side-right-stacked-top"}>
              {renderMediaComponent(
                order[1],
                media,
                videoRef2,
                workspaceWidth * 0.5,
                workspaceHeight * 0.5,
                minimapRatios,
                loopStart,
                loopEnd,
              )}
            </div>
          </div>
          <div className={"display-area-side-by-side-left"}>
            {renderMediaComponent(
              order[2],
              media,
              videoRef2,
              workspaceWidth * 0.5,
              workspaceHeight,
              minimapRatios,
              loopStart,
              loopEnd,
            )}
          </div>
        </div>
      )}

      {media && layout === "side-by-side-right-stacked" && (
        <div
          className={"display-area-side-by-side"}
          style={{
            height: workspaceHeight * minimapRatios["remainder"],
            width: workspaceWidth,
          }}
        >
          <div className={"display-area-side-by-side-left"}>
            {renderMediaComponent(
              order[0],
              media,
              videoRef2,
              workspaceWidth * 0.5,
              workspaceHeight,
              minimapRatios,
              loopStart,
              loopEnd,
            )}
          </div>
          <div className={"display-area-side-by-side-right"}>
            <div className={"display-area-side-by-side-right-stacked-top"}>
              {renderMediaComponent(
                order[1],
                media,
                videoRef2,
                workspaceWidth * 0.5,
                workspaceHeight * 0.5,
                minimapRatios,
                loopStart,
                loopEnd,
              )}
            </div>
            <div className={"display-area-side-by-side-right-stacked-top"}>
              {renderMediaComponent(
                order[2],
                media,
                2,
                workspaceWidth * 0.5,
                workspaceHeight * 0.5,
                minimapRatios,
                loopStart,
                loopEnd,
              )}
            </div>
          </div>
        </div>
      )}
      {media && layout === "four" && (
        <div
          style={{
            height: workspaceHeight * minimapRatios["remainder"],
            width: workspaceWidth,
          }}
        >
          <div className="display-area-stacked-bottom">
            <div className="display-area-side-by-side">
              <div className="display-area-side-by-side-left">
                {renderMediaComponent(
                  order[0],
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
              <div className="display-area-side-by-side-left">
                {renderMediaComponent(
                  order[1],
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
            </div>
          </div>
          <div className="display-area-stacked-bottom">
            <div className="display-area-side-by-side">
              <div className="display-area-side-by-side-left">
                {renderMediaComponent(
                  order[2],
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
              <div className="display-area-side-by-side-left">
                {renderMediaComponent(
                  order[3],
                  media,
                  videoRef2,
                  workspaceWidth * 0.5,
                  workspaceHeight * 0.5,
                  minimapRatios,
                  loopStart,
                  loopEnd,
                )}
              </div>
            </div>
          </div>
        </div>
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
          videoRef={videoRef}
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
