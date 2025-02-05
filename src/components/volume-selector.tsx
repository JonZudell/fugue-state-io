"use client";
import { useState } from "react";
import { selectPlayback, setVolume } from "@/store/playback-slice";
import { useSelector, useDispatch } from "react-redux";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Volume, Volume1, Volume2 } from "lucide-react";

interface SpanSliderProps {
  className?: string;
  enabled?: boolean;
}

const VolumeSelector: React.FC<SpanSliderProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { volume } = useSelector(selectPlayback);
  const [thumbValue, setThumbValue] = useState(volume);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className={`${className} flex items-center`}>
          <div className="h-8 w-8 mt-2">
            {volume === 0 ? (
              <Volume />
            ) : volume < 0.5 ? (
              <Volume1 />
            ) : (
              <Volume2 />
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
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
      </HoverCardContent>
    </HoverCard>
  );
};

export default VolumeSelector;
