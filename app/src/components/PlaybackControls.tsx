"use client";
import "./PlaybackControls.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setPlaying,
  selectPlaying,
  selectTimeElapsed,
  selectMedia,
  setTimeElapsed,
} from "../store/playbackSlice";
import { useEffect, useState } from "react";
interface PlaybackControlsProps {
  focused?: boolean;
  enabled?: boolean;
  onTimeElapsedChange?: (time: number) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  enabled = true,
  onTimeElapsedChange,
}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed);
  const [isDragging, setIsDragging] = useState(false);

  const togglePlay = () => {
    dispatch(setPlaying(!isPlaying));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    if (isPlaying) {
      dispatch(setPlaying(false));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (isPlaying) {
      dispatch(setPlaying(true));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeElapsed = (Number(e.target.value) / 100) * media.duration;
    dispatch(setTimeElapsed(newTimeElapsed));
    if (onTimeElapsedChange) {
      onTimeElapsedChange(newTimeElapsed);
    }
  };

  return (
    <div
      className={`playback-controls h-full w-full bg-gray-600 items-center border rounded mx-auto`}
    >
      <div className="w-full px-4" style={{ height: "80%" }}>
        {media && (
          <div className="text-white text-center mb-2 w-full">
            <input
              className="elapsed-bar"
              type="range"
              min="0"
              step={0.01}
              max="100"
              value={(timeElapsed / media.duration) * 100}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onChange={handleChange}
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
            icon={isPlaying ? faPause : faPlay}
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
