"use client";
import "@/components/playback-controls.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectPlayback,
  setPlaying,
  setLooping,
  setLoopStart,
  setLoopEnd,
  setTimeElapsed,
  setVolume,
} from "@/store/project-slice";
import SpanSlider from "@/components/span-slider";
import VolumeSelector from "@/components/volume-selector";
import SpeedSelector from "@/components/speed-selector";
import Slider from "@/components/slider-input";
import { Code, PauseCircle, PlayCircle, Repeat, Repeat1 } from "lucide-react";
import { selectDisplay, setEditor } from "@/store/display-slice";
import { selectProject } from "@/store/project-slice";
import { use, useEffect, useRef } from "react";
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
  const { editor } = useSelector(selectDisplay);
  const { mediaFiles } = useSelector(selectProject);
  const { playing, looping, timeElapsed, timelineDuration, volume, loopStart, loopEnd  } =
    useSelector(selectPlayback);
  const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
  const sources = useRef(new Map<string, AudioBufferSourceNode & { offset: number }>());
  const gainNode = useRef(audioContext.current.createGain());
  const destination = useRef(audioContext.current.destination);
  const playingRef = useRef(playing);
  const elapsedAtStart = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playingRef.current) {
        dispatch(setTimeElapsed(audioContext.current.currentTime - elapsedAtStart.current));
      } else {
        elapsedAtStart.current = audioContext.current.currentTime - timeElapsed;
      }
    }, 50);
    return () => {
      clearInterval(interval);
    }
  }, []);
  useEffect(() => {
    playingRef.current = playing;
    if (playing) {
      const startTime = audioContext.current.currentTime + 0.1;
      elapsedAtStart.current = audioContext.current.currentTime - timeElapsed;
      setUpMedia();
      audioContext.current.resume().then(() => {
        sources.current.forEach((source) => {
          source.start(startTime, timeElapsed - source.offset);
        });
      });
    } else {
      audioContext.current.suspend();
      setUpMedia();
    }
  }, [playing]);


  useEffect(() => {
    if (!playingRef.current) {

    }

  }, [timeElapsed]);

  useEffect(() => {
    gainNode.current.gain.value = volume;
  }, [volume])


  useEffect(() => {
    setUpMedia();
  }, [mediaFiles]);

  const setUpMedia = () => {
    sources.current.forEach((source) => {
      source.disconnect();
    });
    gainNode.current.disconnect();
    destination.current.disconnect();
    sources.current.clear();
    for (const mediaFile of Object.values(mediaFiles)) {
      const source = audioContext.current.createBufferSource() as AudioBufferSourceNode & { offset: number };
      source.buffer = mediaFile.audioBuffer;
      source.offset = mediaFile.offset;
      source.connect(gainNode.current);
      sources.current.set(mediaFile.id, source);
    }
    gainNode.current.connect(destination.current);
  }

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
      <Slider />
      {looping && (
        <SpanSlider callback={handleSpanSliderChange} enabled={!playing} />
      )}
      <div
        className="playback-controls bg-black text-white px-4"
        style={{
          height: height,
          width: width,
          paddingTop: !looping ? "11px" : "0px",
        }}
      >
        <div id="button-wrapper" className="w-full flex justify-between">
          <div className="flex">
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
                <Repeat className="h-6 w-6 text-green-500" />
              ) : (
                <Repeat1 className="h-6 w-6" />
              )}
            </button>
            <VolumeSelector className="mx-1" enabled={enabled} />
            <SpeedSelector className="mx-1" enabled={enabled} />
            <div className="flex items-center">
              <span style={{ userSelect: "none" }} className="my-2 mx-4">
                {new Date(timeElapsed * 1000).toISOString().substr(12, 7)} / -
                {new Date((timelineDuration - timeElapsed) * 1000)
                  .toISOString()
                  .substr(12, 7)}
              </span>
            </div>
          </div>

          <button
            className="mx-1"
            disabled={!enabled}
            draggable="false"
            onClick={() => {
              dispatch(setEditor(!editor));
            }}
          >
            {editor ? (
              <Code className="h-6 w-6 text-green-500" />
            ) : (
              <Code className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
export default PlaybackControls;
