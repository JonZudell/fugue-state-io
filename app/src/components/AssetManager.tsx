"use client";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFile, selectFile } from '../store/fileSlice'; // Ensure you have the correct path to your filesSlice
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { fileToBase64 } from '../utils/fileUtils'; // Import the utility function
import './AssetManager.css'
interface AssetManagerProps {
  focused?: boolean;
}

const AssetManager: React.FC<AssetManagerProps> = ({ focused = false }) => {
  const dispatch = useDispatch();

  //const assets = useSelector(selectActiveFiles);
  const file = useSelector(selectFile);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(async (file) => {
        const base64 = await fileToBase64(file);
        dispatch(addFile({ name: file.name, fileType: file.type, encoding: base64 }));
      });
    }
  };
  return (
    <div className={`asset-manager m-4 ${focused ? 'focused' : ''}`}>
      <div
        className="upload-placeholder" style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
        <FontAwesomeIcon icon={faFileUpload} className='w-8 h-8' />
        <p>Drag to upload!</p>
        <p>-or-</p>
        <input
          type="file"
          onChange={handleFileUpload}
          className="upload-button text-gray-400"
          multiple
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
          Click to upload files
        </label>
      </div>
    </div>
  );
}

export default AssetManager;