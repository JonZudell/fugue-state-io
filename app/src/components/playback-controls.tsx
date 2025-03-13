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
  const mediaGainRefs = useRef(new Map<string, GainNode>());
  const {primarySourceId} = useSelector(selectPlayback);
  const gainNode = useRef(audioContext.createGain());
  const workletNode = useRef<AudioWorkletNode | null>(null);
  const destination = useRef(audioContext.destination);
  const playingRef = useRef(playing);
  const timeRef = useRef(0);
  const speedRef = useRef(speed);
  const restartTrigger = useRef<number | null>(null);
  const pitchFactor = useRef(0);
  const timeouts = useRef<number[]>([]);
  const initialized = useRef(false);
  useEffect(() => {
    const setUpAudioWorklet = async () => {
      await audioContext.audioWorklet.addModule('phase-vocoder.js');
      workletNode.current = new AudioWorkletNode(audioContext, 'phase-vocoder');
    };
    setUpAudioWorklet();

    for (const mediaFile of Object.values(mediaFiles)) {
      videoRefs.current.set(mediaFile.id, createRef<HTMLVideoElement>());
      mediaGainRefs.current.set(mediaFile.id, audioContext.createGain());
    }

    const interval = setInterval(() => {
      if (initialized.current) {
        if (playingRef.current) {
          timeRef.current = timeRef.current + (0.05 * speedRef.current);
          if (looping && timeRef.current >= loopEnd) {
            stopAllVideos();
            timeRef.current = loopStart * timelineDuration;
            startAllVideos();
          } else if (timeRef.current >= timelineDuration) {
            dispatch(setPlaying(false));
            stopAllVideos();
            timeRef.current = loopStart * timelineDuration;
          }
          dispatch(setTimeElapsed(timeRef.current));

        }
      } else {
        if (workletNode.current) {
          setUpMedia();
        } else {
          console.log("worklet node not ready");
        }
      }
    }, 50);
    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    gainNode.current.gain.value = volume;
  }, [volume]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    if (!playing) {
      timeRef.current = timeElapsed;
    } 
  }, [playing, timeElapsed])
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    console.log("setting time elapsed", timeRef.current);
    dispatch(setTimeElapsed(timeRef.current));
  }, [timeRef]);

  useEffect(() => {
    if (playing) {
      console.log("starting all videos");
      startAllVideos();
    } else {
      stopAllVideos();
      for (const timeout of timeouts.current) {
        clearTimeout(timeout);
      }
      timeouts.current = [];
    }
  }, [playing]);

  useEffect(() => {
    setUpMedia();
  }, [mediaFiles, workletNode.current]);
  useEffect(() => {
    console.log("media files changed", mediaFiles);
    for (const mediaFile of Object.values(mediaFiles)) {
      mediaGainRefs.current.get(mediaFile.id).gain.value = mediaFile.volume;
    }
  }, [mediaFiles]);
  const setUpMedia = () => {
    console.log("setting up media");
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
      const videoElement = videoRefs.current.get(mediaFile.id)?.current;
      console.log("setting up media", mediaFile, videoElement);
      videoElement.currentTime = timeRef.current - mediaFile.offset;
      videoElement.playbackRate = speed;
      if (videoElement) {
        const source = audioContext.createMediaElementSource(videoElement);
        sources.current.set(mediaFile.id, source);
        const mediaGain = mediaGainRefs.current.get(mediaFile.id)
        mediaGain.gain.value = mediaFile.volume;
        mediaGain.disconnect();
        source.connect(mediaGain);
        mediaGain.connect(workletNode.current);
        sources.current.set(mediaFile.id, source);
      }
    }
    workletNode.current.connect(gainNode.current);
    gainNode.current.connect(destination.current);
    initialized.current = true;
  }
  const stopAllVideos = () => {
    for (const video of videoRefs.current.values()) {
      video.current?.pause();
    }
    for (const timeout of timeouts.current) {
      clearTimeout(timeout);
    }
  }
  const startAllVideos = () => {
    // scenario 1:
    //  time = 0
    //  speed = 1
    //  video1 offset = 0 duration 60 -- start 50ms from function call at time 0
    //  video2 offset = -15 duration 30 -- start 50ms from function call at time 15
    //  video3 offset = 10 duration 20 -- start 10050ms from function call at time 0
    //  video4 offset = -30 duration 30 -- not started
    // scenario 2:
    //  time = 10
    //  speed = 1
    //  video1 offset = 0 duration 60 -- start 50ms from function call at time 10
    //  video2 offset = -15 duration 30 -- start 50ms from function call at time 25
    //  video3 offset = 10 duration 20 -- start 50ms from function call at time 0
    
    const startTime = Date.now() + 50;
    for (const media of Object.values(mediaFiles)) {
      const video = videoRefs.current.get(media.id)?.current;
      if (media.duration <= -media.offset) {
        continue; // video 4
      }
      if (timeRef.current >= media.offset) {
        video.currentTime = timeRef.current - media.offset;
        video.playbackRate = speed;
        timeouts.current.push(setTimeout(() => {
          console.log("starting video immediately", media.id);
          if (video.currentTime !== media.duration) {
            video.play();
          }
        }, Date.now() - startTime));
      } else {
        video.currentTime = 0;
        video.playbackRate = speed;
        timeouts.current.push(setTimeout(() => {
          console.log("starting video on delay", media.id);
          video.play();
        }, (Date.now() - startTime) + ((media.offset - timeRef.current) * 1000)));
      }
    }
  }

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
              onClick={() => {dispatch(setPlaying(!playing));}}
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
                {timeElapsed >= 0 ? new Date(timeElapsed * 1000).toISOString().substr(12, 7) : "invalid"} / -
                {timelineDuration - timeElapsed >= 0 ? new Date((timelineDuration - timeElapsed) * 1000)
                  .toISOString()
                  .substr(12, 7) : "invalid"}
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
