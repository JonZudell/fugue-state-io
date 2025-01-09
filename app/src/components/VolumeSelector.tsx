"use client";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { selectVolume, setVolume } from "../store/playbackSlice";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

interface SpanSliderProps {
  className?: string;
  enabled?: boolean;
}

const VolumeSelector: React.FC<SpanSliderProps> = ({ className, enabled }) => {
  const dispatch = useDispatch();
  const volume = useSelector(selectVolume);
  const [thumbValue, setThumbValue] = useState(volume);

  return (
    <div
      className={`${className} flex items-center`}
    >
      <div className="h-6 w-6">
        <FontAwesomeIcon
          className={
            thumbValue > 0
              ? thumbValue > 0.75
                ? "h-6 w-6"
                : "h-6 w-6"
              : "h-6 w-6"
          }
          icon={
            thumbValue > 0
              ? thumbValue > 0.75
                ? faVolumeHigh
                : faVolumeLow
              : faVolumeOff
          }
        />
      </div>
      <input
        type="range"
        min="0"
        step={0.01}
        max="1"
        className="slider vertical ml-2"
        id="volume"
        value={thumbValue}
        onChange={(e) => {
          const newVolume = Number(e.target.value);
          setThumbValue(newVolume);
          dispatch(setVolume(newVolume));
        }}
      />
    </div>
  );
};

export default VolumeSelector;
