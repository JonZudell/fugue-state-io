"use client";
import { useState } from "react";
import { selectPlayback, setSpeed } from "@/store/playback-slice";
import { useSelector, useDispatch } from "react-redux";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
interface SpeedSelectorProps {
  className?: string;
  enabled?: boolean;
}

const SpeedSelector: React.FC<SpeedSelectorProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { speed } = useSelector(selectPlayback);
  const [thumbValue, setThumbValue] = useState(speed);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="h-8 w-8 flex items-center my-[0.25rem]">
          <span className="">{thumbValue.toFixed(2)}x</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
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
      </HoverCardContent>
    </HoverCard>
  );
};

export default SpeedSelector;
