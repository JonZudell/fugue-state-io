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
interface PlaybackControlsProps {
  enabled?: boolean;
  timeElapsed: number;
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
    console.log("handleSpanSlider", start, finish);
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
    console.log(percent, duration);
    const date = new Date(percent * duration * 1000);
    console.log(date);
    return date.toISOString().substr(11, 8);
  };

  const handleToggleLooping = () => {
    dispatch(setLooping(!looping));
  };

  return (
    <div
      className={`playback-controls h-full bg-gray-600 items-center border rounded mx-auto`}
    >
      <div className="px-4" style={{ height: "80%" }}>
        {media && (
          <div className="text-white text-center mb-2">
            <span className="float-left">
              {formatTime(loopStart, media.duration)}
            </span>
            <span className="float-right">
              {formatTime(loopEnd, media.duration)}
            </span>
            <SpanSlider callback={handleSpanSliderChange} enabled={!playing} />
            <input
              className="elapsed-bar"
              type="range"
              min="0"
              step={0.01}
              max="100"
              value={(timeElapsed / media.duration) * 100}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onChange={handleTimeElapsedChange}
            />
            <span className="float-left">
              {new Date(timeElapsed * 1000).toISOString().substr(11, 8)}
            </span>
            <span className="float-right">
              {" "}
              -{" "}
              {new Date((media.duration - timeElapsed) * 1000)
                .toISOString()
                .substr(11, 8)}
            </span>
          </div>
        )}
      </div>
      <div
        className="mx-auto flex justify-center py-4"
        style={{ height: "20%" }}
      >
        <button disabled={!enabled}>
          <FontAwesomeIcon className="h-8 w-8" icon={faChevronLeft} />
        </button>
        <button className="mx-2" onClick={togglePlay} disabled={!enabled}>
          <FontAwesomeIcon
            className="h-8 w-8"
            icon={playing ? faPause : faPlay}
          />
        </button>
        <button
          className="mx-2"
          onClick={handleToggleLooping}
          disabled={!enabled}
        >
          <FontAwesomeIcon
            className="h-8 w-8"
            icon={faRepeat}
            style={{ color: looping ? "green" : "white" }}
          />
        </button>
        <button disabled={!enabled}>
          <FontAwesomeIcon className="h-8 w-8" icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};
export default PlaybackControls;
