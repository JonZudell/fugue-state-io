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
  const primarySourceId = Object.keys(mediaFiles)[0];
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
      timeRef.current = loopStart * timelineDuration;
      dispatch(setTimeElapsed(timeRef.current));
    }
  }, [loopStart])

  useEffect(() => {
    if (loopEndRef.current !== loopEnd) {
      timeRef.current = loopStart * timelineDuration;
      dispatch(setTimeElapsed(timeRef.current));
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
      const startTime = audioContext.currentTime + 0.1;
      setUpMedia();
      audioContext.resume().then(() => {
        videoRefs.current.forEach((videoRef) => {
          if (videoRef.current) {
            videoRef.current.currentTime = timeRef.current;
            videoRef.current.playbackRate = speed;
            videoRef.current.play();
          }
        });
      });
    } else {
      audioContext.suspend();
      setUpMedia();
    }
  }, [playing]);

  // useEffect(() => {
  //   if (looping && timeElapsed >= loopEnd * timelineDuration) {
  //     dispatch(setTimeElapsed(loopStart * timelineDuration));
  //     audioContext.suspend();
  //     dispatch(setPlaying(false));
  //     restartTrigger.current = audioContext.currentTime;
  //   } else if (looping && timeElapsed < loopStart * timelineDuration) {
  //     dispatch(setTimeElapsed(loopStart * timelineDuration));
  //     audioContext.suspend();
  //     setUpMedia();
  //     dispatch(setPlaying(false));
  //     restartTrigger.current = audioContext.currentTime;
  //   } else if (!looping && timeElapsed >= timelineDuration) {
  //     dispatch(setTimeElapsed(0));
  //     audioContext.suspend();
  //     dispatch(setPlaying(false));
  //   }
  // }, [timeElapsed, loopStart, loopEnd, looping]);

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
      const source = audioContext?.createMediaElementSource(videoRefs.current.get(mediaFile.id).current);

      if (source) {
        source.connect(workletNode.current);
      }
      sources.current.set(mediaFile.id, source);
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
        <SpanSlider callback={handleSpanSliderChange} />
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
      <video
        ref={videoRefs.current.get(primarySourceId)}
        style={{ display: "none" }}
        onTimeUpdate={(e) => {
          if (playing) {
            if (looping && e.currentTarget.currentTime >= loopEnd * timelineDuration) {
              dispatch(setTimeElapsed(loopStart * timelineDuration));
              dispatch(setPlaying(false));
              videoRefs.current.get(primarySourceId).current.currentTime = loopStart * timelineDuration;
              restartTrigger.current = audioContext.currentTime;
            } else if (looping && e.currentTarget.currentTime < loopStart * timelineDuration) {
              dispatch(setTimeElapsed(loopStart * timelineDuration));
              dispatch(setPlaying(false));
              videoRefs.current.get(primarySourceId).current.currentTime = loopStart * timelineDuration;
              restartTrigger.current = audioContext.currentTime;
            } else if (!looping && e.currentTarget.currentTime >= timelineDuration) {
              dispatch(setTimeElapsed(0));
              dispatch(setPlaying(false));
            }
          }
        }}
        controls={false}
      >
        <source src={mediaFiles[primarySourceId].url} type={mediaFiles[primarySourceId].fileType}/>
      </video>
      {Object.values(mediaFiles).map((mediaFile) => 
        {primarySourceId !== mediaFile.id &&
        (<video
          key={mediaFile.id}
          ref={videoRefs.current.get(mediaFile.id)}
          style={{ display: "none" }}
        >
          <source src={mediaFile.url} type={mediaFile.fileType}/>
        </video>)
        }
      )}
    </>
  );
};
export default PlaybackControls;
