"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFiles } from "../store/filesSlice";
import { addFileAndSetMedia } from "../store/playbackSlice";
import { Key } from "react";
import { AppDispatch } from "../store";
import "./AssetManager.tsx";
import CollapseMenu from "./CollapseMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
interface AssetManagerProps {
  focused?: boolean;
}

const AssetManager: React.FC<AssetManagerProps> = ({ focused = false }) => {
  const dispatch = useDispatch<AppDispatch>();

  //const assets = useSelector(selectActiveFiles);
  const files = useSelector(selectFiles);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(async (file) => {
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
  return (
    <div className={`asset-manager m-4 ${focused ? "focused" : ""}`}>
      <div
        className="upload-placeholder"
        style={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <FontAwesomeIcon icon={faFileUpload} className="w-8 h-8" />
        <p>Drag to upload!</p>
        <p>-or-</p>
        <input
          type="file"
          onChange={handleFileUpload}
          className="upload-button text-gray-400"
          multiple
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
          Click to upload files
        </label>
      </div>
      {files.files.length > 0 && (
        <CollapseMenu title={"All Assets"}>
          <div className="content">
            {files.files.map((file: { name: string }, index: Key) => (
              <div key={index}>{file.name}</div>
            ))}
          </div>
        </CollapseMenu>
      )}
    </div>
  );
};

export default AssetManager;
