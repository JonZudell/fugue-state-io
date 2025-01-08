"use client";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { selectVolume, setVolume } from "../store/playbackSlice";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeLow, faVolumeOff, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

interface SpanSliderProps {
  className?: string;
  enabled?: boolean;
}

const VolumeSelector: React.FC<SpanSliderProps> = ({
  className,
  enabled
}) => {
  const dispatch = useDispatch();
  const volume = useSelector(selectVolume);
  const [thumbValue, setThumbValue] = useState(volume);
  const [hidden, setHidden] = useState(true);

  return (
    <div
      className={`${className} flex items-center`} 
      onMouseOver={() => setHidden(false)}
    >
      <div className="h-8 w-8">
        <FontAwesomeIcon className={thumbValue > 0 ? thumbValue > .75 ? "h-8 w-8" : "h-6 w-6 mt-1 mr-2" : "h-6 w-6 mt-1 mr-2"} icon={thumbValue > 0 ? thumbValue > .75 ? faVolumeHigh : faVolumeLow: faVolumeOff} />
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
