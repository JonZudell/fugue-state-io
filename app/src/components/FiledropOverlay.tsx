"use client";
import { addFileAndSetMedia } from "@/store/playbackSlice";
import { addFile } from "../store/filesSlice";
import { AppDispatch } from "../store";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
interface FiledropOverlay {
  focused?: false;
}

const FiledropOverlay: React.FC = () => {
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
          console.log(file);
          const reader = new FileReader();
          reader.onload = function (e) {
            if (e && e.target && e.target.result) {
              const base64String = (e.target.result as string).split(",")[1];
              const dataUrl = `data:${file.type};base64,${base64String}`;
              const audio = new Audio(dataUrl);
              audio.onloadedmetadata = function () {
                const duration = audio.duration;
                dispatch(
                  addFileAndSetMedia({
                    name: file.name,
                    fileType: file.type,
                    encoding: base64String,
                    url: dataUrl,
                    duration: duration,
                  }),
                );
              };
            }
          };
          reader.readAsDataURL(file);
        });
      }
    };
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [dispatch]);

  if (!isDragging) {
    return null;
  }

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
      <div className="modal">
        <div
          className="upload-placeholder"
          style={{
            border: "2px dashed #ccc",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default FiledropOverlay;
