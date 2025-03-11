"use client";

import React, { useEffect, useRef, useState } from "react";
import { Node } from "@/store/display-slice";
interface DisplayProps {
  width: number;
  height: number;
}
const TimelineDisplay: React.FC<DisplayProps> = ({
  width,
  height,
}) => {
  return <div style={{ width: `${width}px`, height: `${height}px` }}>Leaf</div>;
};

export default TimelineDisplay;
