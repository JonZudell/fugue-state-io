"use client";

import { selectProject } from "@/store/project-slice";
import * as React from "react";
import { useSelector } from "react-redux";
import TimelineMenuItem from "./timeline-menu-item";
export function TimelineMenu() {
  const { mediaFiles } = useSelector(selectProject); 
  return (
    <div className="flex flex-col flex-1 m-2">
      <label>Media Assets</label>
      {Object.keys(mediaFiles).map((key) => (
        <TimelineMenuItem key={key} className={"h-56 max-h-56 bg-black"} mediaFile={mediaFiles[key]}/>
      ))}
    </div>
  );
}

export default TimelineMenu;