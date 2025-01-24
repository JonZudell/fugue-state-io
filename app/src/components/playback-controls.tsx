"use client";
import "@/components/playback-controls.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setPlaying,
  selectPlaying,
  selectMedia,
  setLooping,
  setLoopStart,
  setLoopEnd,
  selectLooping,
  selectTimeElapsed,
} from "@/store/playback-slice";
import SpanSlider from "@/components/span-slider";
import VolumeSelector from "@/components/volume-selector";
import SpeedSelector from "@/components/speed-selector";
import Slider from "@/components/slider-input";
import { PauseCircle, PlayCircle, Repeat, Repeat1 } from "lucide-react";
interface PlaybackControlsProps {
  enabled?: boolean;
  width: number;
  height: number;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  enabled = true,
  height,
  width,
}) => {
  const dispatch = useDispatch();
  const media = useSelector(selectMedia);
  const playing = useSelector(selectPlaying);
  const looping = useSelector(selectLooping);
  const timeElapsed = useSelector(selectTimeElapsed);

  const togglePlay = () => {
    dispatch(setPlaying(!playing));
  };

  const handleSpanSliderChange = (start: number, finish: number) => {
    dispatch(setLoopStart(start));
    dispatch(setLoopEnd(finish));
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
        className="playback-controls bg-gray-800 text-white px-4 z-100"
        style={{ height: height, width: width }}
      >
        {media && (
          <div className="h-full flex flex-col">
            <div className={`flex w-full`}>
              <button
                className="mx-1"
                onClick={togglePlay}
                disabled={!enabled}
                draggable="false"
              >
                {playing ? (
                  <PauseCircle className="h-6 w-6" />
                ) : (
                  <PlayCircle className="h-6 w-6" />
                )}
              </button>
              <button
                className="mx-1"
                onClick={handleToggleLooping}
                disabled={!enabled}
                draggable="false"
              >
                {looping ? (
                  <Repeat className="h-6 w-6" />
                ) : (
                  <Repeat1 className="h-6 w-6" />
                )}
              </button>
              <VolumeSelector className="mx-1" enabled={enabled} />
              <SpeedSelector className="mx-1" enabled={enabled} />
              <span style={{ userSelect: "none"}} className="my-2 mx-4">

            {new Date(timeElapsed * 1000).toISOString().substr(12, 7)} /{" "}
                -
                {new Date((media.duration - timeElapsed) * 1000)
                  .toISOString()
                  .substr(12, 7)}
              </span>
            </div>

              
            </div>
        )}
      </div>
    </>
  );
};
export default PlaybackControls;
