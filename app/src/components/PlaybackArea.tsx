"use client";
import PlaybackControls from './PlaybackControls';
import { useDispatch, useSelector } from 'react-redux';
import { setPlaying, setSpeed, setVolume, setTimeElapsed } from '../store/playbackSlice';
import { selectFile } from '@/store/fileSlice';
import './PlaybackArea.css';
interface PlaybackAreaProps {
  focused?: false;
}

const PlaybackArea: React.FC<PlaybackAreaProps> = ({ }) => {
  const dispatch = useDispatch();
  const file = useSelector(selectFile);
  return (
    <div className="playbackarea flex">
      <div className="playbackarea-content flex-grow">
        <div className="top-content h-full">
        </div>
        <PlaybackControls />
      </div>
    </div>
  );
}
export default PlaybackArea;