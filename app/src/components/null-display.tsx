"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import WaveformSettings from "./waveform-settings";
import SpectrogramDisplay from "./spectrogram-display";
import SpectrogramSettings from "./spectrogram-settings";
import ContextMenuDialog from "./context-menu-dialog";
const displays = [
  {
    value: "waveform",
    label: "Waveform",
  },
  {
    value: "notation",
    label: "Notation",
  },
  {
    value: "video",
    label: "Video",
  },
  {
    value: "fourier",
    label: "Fourier",
  },
  {
    value: "spectrogram",
    label: "Spectrogram",
  },
];
interface NullDisplayProps {
  width: number;
  height: number;
}
const NullDisplay: React.FC<NullDisplayProps> = ({ width, height }) => {
  return (
    <>
      <ContextMenuDialog
        width={width}
        height={height}
        nodeId={"root"}
        parentNodeId={null}
        parentDirection={null}
        mediaKey={null}
        initialChannel={null}
        initialValue={null}
        isNullDisplay={true}
      >
        <div style={{ width: width, height: height }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: height,
              width: width,
              textAlign: "center",
              color: "gray",
            }}
          >
            No display selected
          </div>
        </div>
      </ContextMenuDialog>
    </>
  );
};

export default NullDisplay;
