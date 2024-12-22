"use client";
import { useEffect, useRef } from "react";
import PlaybackControls from "./PlaybackControls";
import { useDispatch, useSelector } from "react-redux";
import { selectFiles, FileState } from "../store/filesSlice";
import { selectPlaying, selectMedia } from "../store/playbackSlice";
import "./PlaybackArea.css";
interface PlaybackAreaProps {
  focused?: false;
}

const PlaybackArea: React.FC<PlaybackAreaProps> = ({}) => {
  const files = useSelector(selectFiles);

  const playing = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
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

  return (
    <div className="playbackarea flex">
      <div className="playbackarea-content flex-grow">
        <div className="top-content h-full">
          <div
            className="video-container flex justify-center items-center"
            style={{ zIndex: -1 }}
          >
            <video ref={videoRef} controls={false} className="responsive-video">
              <source src={media.url} type={media.fileType} />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="playback-controls absolute bottom-0">
            <PlaybackControls />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaybackArea;
