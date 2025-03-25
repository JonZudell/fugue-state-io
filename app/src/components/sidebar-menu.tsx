"use client";

import { selectProject } from "@/store/project-slice";
import * as React from "react";
import { useSelector } from "react-redux";
import SidebarMediaItem from "./sidebar-media-item";
import SidebarNotationItem from "./sidebar-notation-item";
export function SidebarMenu() {
  const { mediaFiles, abcs } = useSelector(selectProject); 
  return (
    <div className="flex flex-col flex-1 m-2">
      <label>Media</label>
      {Object.keys(mediaFiles).map((key) => (
        <SidebarMediaItem key={key} className={"min-h-56 max-h-56 bg-black"} mediaFile={mediaFiles[key]}/>
      ))}
      <label>Notation</label>
      {Object.keys(abcs).map((key) => (
        <SidebarNotationItem key={key} className={"h-40 max-h-40 bg-black"} abcFile={abcs[key]}/>
      ))}
    </div>
  );
}

export default SidebarMenu;