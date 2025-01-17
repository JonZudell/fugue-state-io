"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFiles } from "../store/filesSlice";
import { uploadFile } from "../store/playback-slice";
import { Key } from "react";
import { AppDispatch } from "../store";
import CollapseMenu from "./CollapseMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
interface AssetManagerProps {
  focused?: boolean;
  worker?: Worker | null;
}

const AssetManager: React.FC<AssetManagerProps> = ({
  focused = false,
  worker,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  //const assets = useSelector(selectActiveFiles);
  const files = useSelector(selectFiles);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("Files selected for upload:", files);
    if (files) {
      Array.from(files).forEach((file) => {
        if (worker) {
          dispatch(uploadFile({ file, worker }));
        }
      });
    }
  };
  return (
    <div
      className={`asset-manager m-4 ${focused ? "focused" : ""} unselectable`}
    >
      <div
        className="upload-placeholder unselectable"
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
      {files.files.length > 0 && (
        <CollapseMenu title={"All Assets"} className="unselectable">
          <div className="content unselectable">
            {files.files.map((file: { name: string }, index: Key) => (
              <div key={index} className="unselectable">
                {file.name}
              </div>
            ))}
          </div>
        </CollapseMenu>
      )}
    </div>
  );
};

export default AssetManager;
