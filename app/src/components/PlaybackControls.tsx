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
import { setPlaying, selectPlaying, selectTimeElapsed, selectMedia, setTimeElapsed } from "../store/playbackSlice";
interface PlaybackControlsProps {
  focused?: boolean;
  enabled?: boolean;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  enabled = true,
}) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectPlaying);
  const media = useSelector(selectMedia);
  const timeElapsed = useSelector(selectTimeElapsed);
  const togglePlay = () => {
    dispatch(setPlaying(!isPlaying));
  };

  return (
    <div
      className={`playback-controls h-full w-full bg-gray-600 items-center border rounded mx-auto`}
    >
      <div className="w-full px-4">
        {media && (
          <div className="text-white text-center mb-2 w-full">
            <span className="float-left">{new Date(timeElapsed * 1000).toISOString().substr(11, 8)}</span>
            <span className="float-right"> - {new Date((media.duration - timeElapsed) * 1000).toISOString().substr(11, 8)}</span>
            <input
              className="elapsed-bar"
              type="range"
              min="0"
              max="100"
              value={(timeElapsed / media.duration) * 100}
              onChange={(e) =>
              dispatch(setTimeElapsed((Number(e.target.value) / 100) * media.duration))
              }
            />
          </div>
        )}
      </div>
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
