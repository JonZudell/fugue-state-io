"use client";
import "./PlaybackControls.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPause,
  faPlay,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setPlaying,
  selectPlaying,
  selectMedia,
  setTimeElapsed,
  setLooping,
  selectLooping,
} from "../store/playbackSlice";
import SpanSlider from "./SpanSlider";
import VolumeSelector from "./VolumeSelector";
import SpeedSelector from "./SpeedSelector";
interface PlaybackControlsProps {
  enabled?: boolean;
  timeElapsed: number;
  width: number;
  height: number;
  isDraggingRef: React.RefObject<boolean>;
  isPlayingBeforeDragRef: React.RefObject<boolean>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  loopStart: number;
  setLoopStart: (start: number) => void;
  loopEnd: number;
  setLoopEnd: (end: number) => void;
  onTimeElapsedChange?: (time: number) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  className?: string;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  enabled = true,
  timeElapsed,
  isDraggingRef,
  isPlayingBeforeDragRef,
  loopStart,
  setLoopStart,
  loopEnd,
  setLoopEnd,
  videoRef,
  height,
  width,
}) => {
  const dispatch = useDispatch();
  const media = useSelector(selectMedia);
  const playing = useSelector(selectPlaying);
  const looping = useSelector(selectLooping);

  const togglePlay = () => {
    dispatch(setPlaying(!playing));
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
    isPlayingBeforeDragRef.current = playing;
    dispatch(setPlaying(false));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dispatch(setPlaying(isPlayingBeforeDragRef.current));
  };

  const handleSpanSliderChange = (start: number, finish: number) => {
    setLoopStart(start);
    setLoopEnd(finish);
  };

  const handleTimeElapsedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * media!.duration;
    dispatch(setTimeElapsed(newTime));
    if (isPlayingBeforeDragRef.current && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };
  const formatTime = (percent: number, duration: number) => {
    const date = new Date(percent * duration * 1000);
    return date.toISOString().substr(12, 7);
  };

  const handleToggleLooping = () => {
    dispatch(setLooping(!looping));
  };

  return (
    <div
      className="playback-controls bg-gray-800 text-white px-4"
      style={{ height: height, width: width }}
    >
      {media && (
        <div
          className={`flex items-center ${looping ? "looping" : "not-looping"}`}
        >
          <button
            className="mx-1"
            onClick={togglePlay}
            disabled={!enabled}
            draggable="false"
          >
            <FontAwesomeIcon
              className="h-8 w-8"
              icon={playing ? faPause : faPlay}
            />
          </button>
          <VolumeSelector className="mx-1" enabled={enabled} />
          <SpeedSelector className="mx-1" enabled={enabled} />
          <button
            className="mx-1"
            onClick={handleToggleLooping}
            disabled={!enabled}
            draggable="false"
          >
            <FontAwesomeIcon
              className="h-8 w-8"
              icon={faRepeat}
              style={{ color: looping ? "green" : "white" }}
            />
          </button>
          <div className="flex-grow">
            <div className={`flex flex-col ${looping ? "visible" : "hidden"}`}>
              <div className="flex justify-between">
                <span style={{ userSelect: "none" }}>
                  {formatTime(loopStart, media.duration)}
                </span>
                <span style={{ userSelect: "none" }}>
                  {formatTime(loopEnd, media.duration)}
                </span>
              </div>
              <SpanSlider
                callback={handleSpanSliderChange}
                enabled={!playing}
              />
            </div>
            {!looping && <div className="elapsed-bar-buffer" />}
            <input
              className={`elapsed-bar w-full`}
              type="range"
              min="0"
              step={0.01}
              max="100"
              value={(timeElapsed / media.duration) * 100}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onChange={handleTimeElapsedChange}
              draggable="false"
            />
            <div className="flex justify-between">
              <span style={{ userSelect: "none" }}>
                {new Date(timeElapsed * 1000).toISOString().substr(12, 7)}
              </span>
              <span style={{ userSelect: "none" }}>
                {" "}
                -
                {new Date((media.duration - timeElapsed) * 1000)
                  .toISOString()
                  .substr(12, 7)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PlaybackControls;
