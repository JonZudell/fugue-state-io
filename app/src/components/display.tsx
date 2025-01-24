"use client";
import { use, useEffect, useRef } from "react";
import FourierDisplay from "@/components/fourier-display";
import SpectrogramDisplay from "@/components/spectrogram-display";
import WaveformDisplay from "@/components/waveform-display";
import { useDispatch, useSelector } from "react-redux";
import { selectMedia, selectPlaying, selectLoopEnd, selectLoopStart, selectLooping, selectTimeElapsed, selectVolume, selectSpeed, setTimeElapsed } from "@/store/playback-slice";
import { Panel, PanelGroup } from "react-resizable-panels";
import NotationDisplay from "@/components/notation-display";
import { FileState } from "@/store/asset-slice";

interface Display {
  order: string[];
  layout: string;
  width: number;
  height: number;
}

const renderMediaComponent = (
  type: string,
  media: FileState,
  videoRef2: React.RefObject<HTMLVideoElement | null> | null,
  loopStart: number,
  loopEnd: number,
  width: number,
  height: number,
  key: string,
): JSX.Element | null => {
  switch (type) {
    case "none":
      return (
        <div style={{ width: width, height: height }} key={key}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            Display set to None
          </div>
        </div>
      );
    case "video":
      return (
        <video
          ref={videoRef2}
          controls={false}
          className="video-element"
          loop={false}
          style={{
            zIndex: -1,
            width: "100%",
            height: "100%",
          }}
          key={key}
          width={width}
          height={height}
        >
          <source src={media.url} type={media.fileType} />
          Your browser does not support the video tag.
        </video>
      );
    case "waveform":
      return (
        <WaveformDisplay
          key={key}
          media={media}
          startPercentage={loopStart * 100}
          endPercentage={loopEnd * 100}
          width={width}
          height={height}
        />
      );
    case "spectrogram":
      return (
        <SpectrogramDisplay
          key={key}
          media={media}
          startPercentage={loopStart * 100}
          endPercentage={loopEnd * 100}
          width={width}
          height={height}
        />
      );
    case "fourier":
      return (
        <FourierDisplay key={key} media={media} width={width} height={height} />
      );
    case "notation":
      return <NotationDisplay width={width} height={height} />;
    default:
      return null;
  }
};
const Display: React.FC<Display> = ({ order, layout, width, height }) => {
  const media = useSelector(selectMedia);
  const playing = useSelector(selectPlaying);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const looping = useSelector(selectLooping);
  const volume = useSelector(selectVolume);
  const speed = useSelector(selectSpeed);
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
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
      console.log("interval");

      if (playing && videoRef.current) {
        console.log("playing");
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
      }

      if (videoRef2.current) {
        if (Math.abs(videoRef2.current.currentTime - timeElapsed) > 0.3) {
          videoRef2.current.currentTime = timeElapsed;
          if (!playing && !videoRef2.current.paused) {
            videoRef2.current.pause();
          }
        }
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
    videoRef.current,
    videoRef2.current,
    layout,
    order,
  ]);

  useEffect(() => {
    if (videoRef2.current) {
      videoRef2.current.volume = 0;
      videoRef2.current.playbackRate = speed;
      videoRef2.current.loop = false;
    }
  }, [videoRef2.current, speed]);
  return (
    <div style={{ width: width + "px", height: height + "px" }}>
      {!media && (
        <div style={{ width: width, height: height }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            Inconceivable! Media is null.
          </div>
        </div>
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
      {layout === "none" && (
        <PanelGroup
          direction="horizontal"
          style={{
            width: width + "px",
            height: height + "px",
          }}
        >
          <Panel
            style={{
              width: width + "px",
              height: height + "px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: width + "px",
                height: height + "px",
              }}
            >
              No Display settings
            </div>
          </Panel>
        </PanelGroup>
      )}
      {layout === "single" && (
        <PanelGroup
          direction="horizontal"
          style={{
            width: width + "px",
            height: height + "px",
          }}
        >
          <Panel
            className="max-h-full h-full"
            style={{
              width: width + "px",
              height: height + "px",
            }}
          >
            {order.map((type, index) =>
              renderMediaComponent(
                type,
                media,
                videoRef2,
                loopStart,
                loopEnd,
                width,
                height,
                `media-${index}`,
              ),
            )}
          </Panel>
        </PanelGroup>
      )}
      {layout === "side-by-side" && (
        <PanelGroup
          direction="horizontal"
          style={{
            width: width + "px",
            height: height + "px",
          }}
        >
          {order.map((type, index) => (
            <Panel key={index} className={`w-[${width / 2}]px h-[${height}]px`}>
              {renderMediaComponent(
                type,
                media,
                videoRef2,
                loopStart,
                loopEnd,
                width / 2,
                height,
                `media-${index}`,
              )}
            </Panel>
          ))}
        </PanelGroup>
      )}
      {layout === "stacked" && (
        <PanelGroup
          direction="vertical"
          style={{
            width: width + "px",
            height: height + "px",
          }}
        >
          {order.map((type, index) => (
            <Panel key={index} className={`w-[${width}]px h-[${height / 2}]px`}>
              {renderMediaComponent(
                type,
                media,
                videoRef2,
                loopStart,
                loopEnd,
                width,
                height / 2,
                `media-${index}`,
              )}
            </Panel>
          ))}
        </PanelGroup>
      )}
      {layout === "stacked-3" && (
        <PanelGroup
          direction="vertical"
          style={{
            width: width + "px",
            height: height + "px",
          }}
        >
          {order.map((type, index) => (
            <Panel key={index} className={`w-[${width}]px h-[${height / 3}]px`}>
              {renderMediaComponent(
                type,
                media,
                videoRef2,
                loopStart,
                loopEnd,
                width,
                height / 3,
                `media-${index}`,
              )}
            </Panel>
          ))}
        </PanelGroup>
      )}
      {layout === "side-by-side-3" && (
        <PanelGroup direction="horizontal">
          {order.map((type, index) => (
            <Panel key={index} className={`w-[${width / 3}]px h-[${height}]px`}>
              {renderMediaComponent(
                type,
                media,
                videoRef2,
                loopStart,
                loopEnd,
                width / 3,
                height,
                `media-${index}`,
              )}
            </Panel>
          ))}
        </PanelGroup>
      )}
      {layout === "side-by-side-right-stacked" && (
        <PanelGroup direction="horizontal">
          <Panel className={`w-[${width / 2}]px h-[${height}]px`}>
            {renderMediaComponent(
              order[0],
              media,
              videoRef2,
              loopStart,
              loopEnd,
              width / 2,
              height,
              `media-0`,
            )}
          </Panel>
          <Panel className={`w-[${width / 2}]px h-[${height}]px`}>
            <PanelGroup direction="vertical">
              <Panel className={`w-[${width / 2}]px h-[${height / 2}]px`}>
                {renderMediaComponent(
                  order[1],
                  media,
                  videoRef2,
                  loopStart,
                  loopEnd,
                  width / 2,
                  height / 2,
                  `media-1`,
                )}
              </Panel>
              <Panel className={`w-[${width / 2}]px h-[${height / 2}]px`}>
                {renderMediaComponent(
                  order[2],
                  media,
                  videoRef2,
                  loopStart,
                  loopEnd,
                  width / 2,
                  height / 2,
                  `media-1`,
                )}
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      )}
      {layout === "side-by-side-left-stacked" && (
        <PanelGroup direction="horizontal">
          <Panel className={`w-[${width / 2}]px h-[${height}]px`}>
            <PanelGroup direction="vertical">
              <Panel className={`w-[${width / 2}]px h-[${height / 2}]px`}>
                {renderMediaComponent(
                  order[0],
                  media,
                  videoRef2,
                  loopStart,
                  loopEnd,
                  width / 2,
                  height / 2,
                  `media-1`,
                )}
              </Panel>
              <Panel className={`w-[${width / 2}]px h-[${height / 2}]px`}>
                {renderMediaComponent(
                  order[1],
                  media,
                  videoRef2,
                  loopStart,
                  loopEnd,
                  width / 2,
                  height / 2,
                  `media-1`,
                )}
              </Panel>
            </PanelGroup>
          </Panel>
          <Panel className={`w-[${width / 2}]px h-[${height}]px`}>
            {renderMediaComponent(
              order[2],
              media,
              videoRef2,
              loopStart,
              loopEnd,
              width / 2,
              height,
              `media-0`,
            )}
          </Panel>
        </PanelGroup>
      )}
      {layout === "stacked-bottom-side-by-side" && (
        <PanelGroup direction="vertical">
          <Panel className={`w-[${width / 2}]px h-[${height}]px`}>
            {renderMediaComponent(
              order[0],
              media,
              videoRef2,
              loopStart,
              loopEnd,
              width / 2,
              height,
              `media-0`,
            )}
          </Panel>
          <Panel className={`w-[${width}]px h-[${height / 2}]px`}>
            <PanelGroup direction="horizontal">
              <Panel className={`w-[${width / 2}]px h-[${height / 2}]px`}>
                {renderMediaComponent(
                  order[1],
                  media,
                  videoRef2,
                  loopStart,
                  loopEnd,
                  width / 2,
                  height / 2,
                  `media-1`,
                )}
              </Panel>
              <Panel className={`w-[${width / 2}]px h-[${height / 2}]px`}>
                {renderMediaComponent(
                  order[2],
                  media,
                  videoRef2,
                  loopStart,
                  loopEnd,
                  width / 2,
                  height / 2,
                  `media-1`,
                )}
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      )}
      {layout === "stacked-top-side-by-side" && (
        <PanelGroup direction="vertical">
          <Panel className={`w-[${width}]px h-[${height / 2}]px`}>
            <PanelGroup direction="horizontal">
              <Panel className={`w-[${width / 2}]px h-[${height / 2}]px`}>
                {renderMediaComponent(
                  order[0],
                  media,
                  videoRef2,
                  loopStart,
                  loopEnd,
                  width / 2,
                  height / 2,
                  `media-1`,
                )}
              </Panel>
              <Panel className={`w-[${width / 2}]px h-[${height / 2}]px`}>
                {renderMediaComponent(
                  order[1],
                  media,
                  videoRef2,
                  loopStart,
                  loopEnd,
                  width / 2,
                  height / 2,
                  `media-1`,
                )}
              </Panel>
            </PanelGroup>
          </Panel>
          <Panel className={`w-[${width / 2}]px h-[${height}]px`}>
            {renderMediaComponent(
              order[2],
              media,
              videoRef2,
              loopStart,
              loopEnd,
              width / 2,
              height,
              `media-0`,
            )}
          </Panel>
        </PanelGroup>
      )}
    </div>
  );
};

export default Display;
