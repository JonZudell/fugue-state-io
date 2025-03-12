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
import { createRef, use, useEffect, useRef } from "react";
import { time } from "console";
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
  const { playing, looping, timeElapsed, timelineDuration, volume, loopStart, loopEnd, speed, audioContext  } =
    useSelector(selectPlayback);
  const sources = useRef(new Map<string, AudioBufferSourceNode & { offset: number }>());
  const videoRefs = useRef(new Map<string, React.RefObject<HTMLVideoElement>>());
  const {primarySourceId} = useSelector(selectPlayback);
  const gainNode = useRef(audioContext.createGain());
  const workletNode = useRef<AudioWorkletNode | null>(null);
  const destination = useRef(audioContext.destination);
  const playingRef = useRef(playing);
  const timeRef = useRef(0);
  const speedRef = useRef(1);
  const loopStartRef = useRef(loopStart);
  const loopEndRef = useRef(loopEnd);
  const restartTrigger = useRef<number | null>(null);
  const pitchFactor = useRef(0);
  useEffect(() => {
    const setUpAudioWorklet = async () => {
      await audioContext.audioWorklet.addModule('phase-vocoder.js');
      workletNode.current = new AudioWorkletNode(audioContext, 'phase-vocoder');
    };
    setUpAudioWorklet();

    for (const mediaFile of Object.values(mediaFiles)) {
      videoRefs.current.set(mediaFile.id, createRef<HTMLVideoElement>());
    }
    const interval = setInterval(() => {
      if (playingRef.current) {
        timeRef.current = videoRefs.current.get(primarySourceId).current.currentTime;
        if (looping && timeRef.current >= loopEndRef.current * timelineDuration) {
          timeRef.current = loopStartRef.current * timelineDuration;
          setUpMedia();
          restartTrigger.current = audioContext.currentTime;
        } else if (!looping && timeRef.current >= timelineDuration) {
          timeRef.current = 0;
          setUpMedia();
        }
        dispatch(setTimeElapsed(timeRef.current));
      }

    }, 50);
    return () => {
      clearInterval(interval);
    }
  }, []);
  useEffect(() => {
    if (loopStartRef.current !== loopStart) {
      if (timeRef.current < loopStart * timelineDuration) {
        timeRef.current = loopStart * timelineDuration;
        dispatch(setTimeElapsed(timeRef.current));
      }
    }
  }, [loopStart])

  useEffect(() => {
    if (loopEndRef.current !== loopEnd) {
      if (timeRef.current >= loopEnd * timelineDuration) {
        timeRef.current = loopStart * timelineDuration;
        dispatch(setTimeElapsed(timeRef.current));
      }
    }
  }, [loopEnd])

  useEffect(() => {
    if (speedRef.current !== speed) {
      videoRefs.current.forEach((videoRef) => {
        if (videoRef.current) {
          videoRef.current.playbackRate = speed;
        }
      });
    }
  }, [speed]);


  useEffect(() => {
    if (!playing) {
      timeRef.current = timeElapsed;
      audioContext.resume().then(() => {
        Object.keys(mediaFiles).forEach((id) => {
          if (videoRefs.current.get(id).current) {
            videoRefs.current.get(id).current.currentTime = timeElapsed - mediaFiles[id].offset;
            videoRefs.current.get(id).current.playbackRate = speed;
          }
        });
      });
    }
  }, [timeElapsed, playing])

  useEffect(() => {
    if (restartTrigger.current) {
      dispatch(setPlaying(true));
    }
  }, [restartTrigger.current]);

  useEffect(() => {
    playingRef.current = playing;
    if (playing) {
      setUpMedia();
      audioContext.resume().then(() => {
        Object.keys(mediaFiles).forEach((id) => {
          if (videoRefs.current.get(id).current) {
            videoRefs.current.get(id).current.currentTime = timeElapsed - mediaFiles[id].offset;
            videoRefs.current.get(id).current.playbackRate = speed;
            videoRefs.current.get(id).current.play();
          }
        });
      });
    } else {
      audioContext.suspend();
      setUpMedia();
    }
  }, [playing]);

  useEffect(() => {
    gainNode.current.gain.value = volume;
  }, [volume])


  useEffect(() => {
    setUpMedia();
  }, [mediaFiles, workletNode.current]);

  const setUpMedia = () => {
    
    if (!workletNode.current || videoRefs.current.size === 0) {
      console.log("worklet node not ready or video refs are empty");
      return;
    }
    sources.current.forEach((source) => {
      source.disconnect();
    });
    gainNode.current.disconnect();
    workletNode.current.disconnect();
    destination.current.disconnect();
    sources.current.clear();
    for (const mediaFile of Object.values(mediaFiles)) {
      //const source = audioContext.createBufferSource() as AudioBufferSourceNode & { offset: number };
      const videoElement = videoRefs.current.get(mediaFile.id)?.current;
      console.log(videoElement);
      videoElement.currentTime = timeElapsed - mediaFile.offset;
      videoElement.playbackRate = speed;
      if (videoElement) {
        const source = audioContext.createMediaElementSource(videoElement);
        sources.current.set(mediaFile.id, source);
        source.connect(workletNode.current);
        if (source) {
          source.connect(workletNode.current);
        }
        sources.current.set(mediaFile.id, source);
      }
    }
    workletNode.current.connect(gainNode.current);
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
      {Object.values(mediaFiles).map((mediaFile) => 
        <video
          key={mediaFile.id}
          ref={videoRefs.current.get(mediaFile.id)}
          style={{ display: "none" }}
        >
          <source src={mediaFile.url} type={mediaFile.fileType}/>
        </video>
        
      )}
    </>
  );
};
export default PlaybackControls;
