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
import { useEffect, useState, useRef } from "react";
import SpanSlider from "./SpanSlider";
interface PlaybackControlsProps {
  focused?: boolean;
  enabled?: boolean;
  width?: number;
  onTimeElapsedChange?: (time: number) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  enabled = true
}) => {
  const dispatch = useDispatch();
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const isDraggingRef = useRef(false);
  const isPlayingBeforeDragRef = useRef(false);
  const playing = useSelector(selectPlaying);
  function handleSpanSliderChange(start: number, finish: number): void {
    console.log(start, finish);
  }

  return (
    <div
      className={`playback-controls h-full bg-gray-600 items-center border rounded mx-auto`}
    >
      <div className="px-4" style={{ height: "80%" }}>
        {media && (
          <div className="text-white text-center mb-2">
            {/* <span className="float-left">
              {new Date((loopStart * 1000))
                .toISOString()
                .substr(11, 8)}
            </span>
            <span className="float-right">
              {new Date((loopEnd * 1000))
                .toISOString()
                .substr(11, 8)}
            </span> */}
            <SpanSlider callback={handleSpanSliderChange} />
            <input
              className="elapsed-bar"
              type="range"
              min="0"
              step={0.01}
              max="100"
              value={(timeElapsed / media.duration) * 100}
            />
            {/* <span className="float-left">
              {new Date(timeElapsed * 1000).toISOString().substr(11, 8)}
            </span>
            <span className="float-right">
              {" "}
              -{" "}
              {new Date((media.duration - timeElapsed) * 1000)
                .toISOString()
                .substr(11, 8)}
            </span> */}
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
        <button className="mx-2" disabled={!enabled}>
          <FontAwesomeIcon
            className="h-8 w-8"
            icon={playing ? faPause : faPlay}
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
