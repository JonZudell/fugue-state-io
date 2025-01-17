"use client";
import { uploadFile } from "../store/playback-slice";
import { AppDispatch } from "../store";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
interface FiledropOverlay {
  worker: Worker;
}

const FiledropOverlay: React.FC<FiledropOverlay> = ({worker}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      const files = event.dataTransfer?.files;
      if (files) {
        Array.from(files).forEach(async (file) => {
          dispatch(uploadFile(file));
        });
      }
    };
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [dispatch]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("Files selected for upload:", files);
    if (files) {
      Array.from(files).forEach((file) => {
        dispatch(uploadFile({ file, worker }));
      });
    }
  };
  return (
    <div
      className="scrim flex"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="modal"
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1>Welcome to</h1>
        <h2>fugue-state.io</h2>
        <h3>Upload Files</h3>
        <div
          className="upload-placeholder"
          style={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
        <FontAwesomeIcon icon={faFileUpload} className="w-6 h-6 unselectable" />
        <p className="unselectable">Drag to upload!</p>
        <p className="unselectable">-or-</p>
        <input
          type="file"
          onChange={handleFileUpload}
          className="upload-button text-gray-400"
          multiple
          style={{ display: "none" }}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-blue-500 unselectable"
        >
          Click to upload files
        </label>
      </div>
        </div>
      </div>
  );
};

export default FiledropOverlay;
