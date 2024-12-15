"use client";
import React, { useState, useEffect } from 'react';
interface FiledropOverlay{
  focused?: false;
}

const FiledropOverlay: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  useEffect(() => {
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  if (!isDragging) {
    return null;
  }

  return (
    <div
      className="scrim flex"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="modal">
        {/* Modal content goes here */}
      </div>
    </div>
  );
};

export default FiledropOverlay;