"use client";
import { addFile } from '@/store/fileSlice';
import { fileToBase64 } from '../utils/fileUtils';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
interface FiledropOverlay {
  focused?: false;
}

const FiledropOverlay: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };


  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer?.files;
      if (files) {
        Array.from(files).forEach(async (file) => {
          try {
            const base64 = await fileToBase64(file);
            dispatch(addFile({ name: file.name, fileType: file.type, encoding: base64 }));
          } catch (error) {
            console.error('Error dispatching file:', error);
          }
        });
      }
    };
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [dispatch]);

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
        <div
          className="upload-placeholder"
          style={{
            border: '2px dashed #ccc', borderRadius: '8px', padding: '20px', textAlign: 'center'
          }}>
        </div>
      </div>
    </div>
  );
};

export default FiledropOverlay;