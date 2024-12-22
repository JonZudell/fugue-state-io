"use client";
import "./PlaybackControls.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { setPlaying, selectPlaying } from "../store/playbackSlice";
interface PlaybackControlsProps {
  focused?: boolean;
  enabled?: boolean;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  enabled = true,
}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectPlaying);

  const togglePlay = () => {
    dispatch(setPlaying(!isPlaying));
  };

  return (
    <div
      className={`playback-controls h-full w-full bg-gray-600 items-center border rounded mx-auto`}
    >
      <div className="mx-auto flex justify-center py-4">
        <button disabled={!enabled}>
          <FontAwesomeIcon className="h-8 w-8" icon={faChevronLeft} />
        </button>
        <button className="mx-2" onClick={togglePlay} disabled={!enabled}>
          <FontAwesomeIcon
            className="h-8 w-8"
            icon={isPlaying ? faPause : faPlay}
          />
        </button>
        <button disabled={!enabled}>
          <FontAwesomeIcon className="h-8 w-8" icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};
export default PlaybackControls;
