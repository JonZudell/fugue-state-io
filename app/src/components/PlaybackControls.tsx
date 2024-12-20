"use client";
import './PlaybackControls.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setPlaying, selectPlaying } from '../store/playbackSlice';
interface PlaybackControlsProps {
  focused?: false;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ }) => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(selectPlaying);

  const togglePlay = () => {
    dispatch(setPlaying(!isPlaying));
  };

  return (
    <div className={`playback-controls h-16 bg-gray-600 items-center border rounded mx-auto w-full`}>
      <input type="range" className="volume-slider mx-2" min="0" max="100" />
      <div className='mx-auto flex justify-center py-4'>
        <button className="play-button">
          <FontAwesomeIcon className='h-8 w-8' icon={faChevronLeft} />
        </button>
        <button className="play-button mx-2" onClick={togglePlay}>
          <FontAwesomeIcon className='h-8 w-8' icon={isPlaying ? faPause : faPlay} />
        </button>
        <button className="play-button">
          <FontAwesomeIcon className='h-8 w-8' icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
export default PlaybackControls;