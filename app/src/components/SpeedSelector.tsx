"use client";
import { useState } from "react";
import { selectSpeed, setSpeed } from "../store/playbackSlice";
import { useSelector, useDispatch } from "react-redux";
interface SpeedSelectorProps {
  className?: string;
  enabled?: boolean;
}

const SpeedSelector: React.FC<SpeedSelectorProps> = ({ className }) => {
  const dispatch = useDispatch();
  const speed = useSelector(selectSpeed);
  const [thumbValue, setThumbValue] = useState(speed);

  return (
    <div className={`${className} flex items-center`}>
      <div className="h-8 w-8 flex items-center">
        <span className="transform translate-y1/2">
          {thumbValue.toFixed(2)}x
        </span>
      </div>
      <input
        type="range"
        min="0.2"
        step={0.01}
        max="2.0"
        className="slider vertical ml-2"
        id="volume"
        value={thumbValue}
        onChange={(e) => {
          const newSpeed = Number(e.target.value);
          setThumbValue(newSpeed);
          dispatch(setSpeed(newSpeed));
        }}
      />
    </div>
  );
};

export default SpeedSelector;
