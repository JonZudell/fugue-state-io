"use client";
import { useEffect, useRef } from "react";
import PlaybackControls from "./PlaybackControls";
import { useDispatch, useSelector, } from "react-redux";
import { selectFiles } from "../store/filesSlice";
import { selectPlaying, selectMedia, selectTimeElapsed, setTimeElapsed } from "../store/playbackSlice";
import "./PlaybackArea.css";
interface PlaybackAreaProps {
  focused?: false;
}

const PlaybackArea: React.FC<PlaybackAreaProps> = ({}) => {
  const files = useSelector(selectFiles);

  const dispatch = useDispatch();
  const playing = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed) as number;

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing, files]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeElapsed;
    }
  }, [timeElapsed]);

  useEffect(() => {

    const videoElement = videoRef.current;
    const handleTimeUpdate = () => {
      console.log("time update");
      if (videoElement) {
        dispatch(setTimeElapsed(videoElement.currentTime));
      }
    };

    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  });
  return (
    <div className="playbackarea flex">
      <div className="playbackarea-content flex-grow">
        <div className="top-content h-full">
          <div
            className="video-container flex justify-center items-center"
            style={{ zIndex: -1 }}
          >
            {media && (
              <video ref={videoRef} controls={false} className="responsive-video">
                <source src={media.url} type={media.fileType} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="playback-controls absolute bottom-0 w-3/4 mx-auto">
            <PlaybackControls enabled={media ? true : false} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaybackArea;
