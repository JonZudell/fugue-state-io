"use client";
import PlaybackControls from './PlaybackControls';
import './PlaybackArea.css';
interface PlaybackAreaProps {
  focused?: false;
}

const PlaybackArea: React.FC<PlaybackAreaProps> = ({ }) => {
  return (
    <div className="playbackarea flex">
      <div className="playbackarea-content flex-grow">
        <div className="top-content h-full">
          {/* Your content here */}
        </div>
      <PlaybackControls />
      </div>
    </div>
  );
}
export default PlaybackArea;