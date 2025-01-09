"use client";
import "./PlaybackControls.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faRepeat } from "@fortawesome/free-solid-svg-icons";
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
import Slider from "./Slider";
interface PlaybackControlsProps {
  enabled?: boolean;
  timeElapsed: number;
  width: number;
  height: number;
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
  loopStart,
  setLoopStart,
  loopEnd,
  setLoopEnd,
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

  const handleSpanSliderChange = (start: number, finish: number) => {
    setLoopStart(start);
    setLoopEnd(finish);
  };
  const formatTime = (percent: number, duration: number) => {
    const date = new Date(percent * duration * 1000);
    return date.toISOString().substr(12, 7);
  };

  const handleToggleLooping = () => {
    dispatch(setLooping(!looping));
  };

  return (
    <>
      {looping && (
        <SpanSlider callback={handleSpanSliderChange} enabled={!playing} />
      )}
      <Slider />
      <div
        className="playback-controls bg-gray-800 text-white px-4 items-center"
        style={{ height: looping ? height - 20 : height - 10, width: width }}
      >
        {media && (
            <div className="items-center h-full flex flex-col justify-center">
            <div className={`flex items-center justify-between w-full`}>
              <div className={`flex flex-col`}>
              <div className="flex justify-between">
                <span style={{ userSelect: "none" }}>
                {new Date(timeElapsed * 1000).toISOString().substr(12, 7)}
                </span>
              </div>
              </div>
              <div className="flex">
              <VolumeSelector className="mx-1" enabled={enabled} />
              <button
                className="mx-1"
                onClick={togglePlay}
                disabled={!enabled}
                draggable="false"
              >
                <FontAwesomeIcon
                className="h-6 w-6"
                icon={playing ? faPause : faPlay}
                />
              </button>
              <button
                className="mx-1"
                onClick={handleToggleLooping}
                disabled={!enabled}
                draggable="false"
              >
                <FontAwesomeIcon
                className="h-6 w-6"
                icon={faRepeat}
                style={{ color: looping ? "green" : "white" }}
                />
              </button>
              <SpeedSelector className="mx-1" enabled={enabled} />
              </div>
              <div className="flex">
              <span style={{ userSelect: "none" }}>
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
    </>
  );
};
export default PlaybackControls;
