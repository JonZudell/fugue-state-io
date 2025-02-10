"use client";

import React, { useState } from "react";
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
import { cn } from "@/utils/utils";
import WaveformSettings from "./waveform-settings";
import SpectrogramSettings from "./spectrogram-settings";
import { removeNode, splitNode } from "@/store/display-slice";
import { useDispatch } from "react-redux";
import FourierSettings from "./fourier-settings";
import NotationSettings from "./notation-settings";
import VideoSettings from "./video-settings";
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
interface ContextMenuDialogProps {
  width: number;
  height: number;
  children: React.ReactNode;
  nodeId?: string | null;
  parentNodeId?: string | null;
  parentDirection?: string | null;
  initialValue: string | null;
  mediaKey?: string | null;
  abcKey?: string | null;
  initialChannel?: string | null;
  isNullDisplay?: boolean;
}
const ContextMenuDialog: React.FC<ContextMenuDialogProps> = ({
  abcKey,
  children,
  nodeId,
  parentNodeId,
  mediaKey,
  initialChannel,
  initialValue,
  isNullDisplay,
}) => {
  const dispatch = useDispatch();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <Dialog defaultOpen={false} modal={false}>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          {isNullDisplay ? (
            <DialogTrigger>
              <ContextMenuItem>
                <span>Add Display</span>
              </ContextMenuItem>
            </DialogTrigger>
          ) : (
            <>
            <DialogTrigger>
              <ContextMenuItem>
                <span>Edit Display Settings</span>
              </ContextMenuItem>
              </DialogTrigger>
              <ContextMenuItem
                onClick={() => {
                  if (!nodeId) return;
                  dispatch(removeNode(nodeId));
                }}
              >
                <span>Remove Display</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  if (!nodeId) return;
                  dispatch(
                    splitNode({
                      nodeId,
                      direction: "vertical",
                      parentId: parentNodeId,
                    }),
                  );
                  console.log("removeNode", nodeId);
                }}
              >
                <span>Split Display Vertical</span>
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  if (!nodeId || !parentNodeId) return;
                  dispatch(
                    splitNode({
                      nodeId,
                      direction: "horizontal",
                      parentId: parentNodeId,
                    }),
                  );
                }}
              >
                <span>Split Display Horizontal</span>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Display</DialogTitle>
            <DialogDescription>
              Select and configure a new display type.
            </DialogDescription>
          </DialogHeader>{" "}
          <Separator />
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">Display Type</p>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? displays.find((framework) => framework.value === value)
                        ?.label
                    : "Select Display..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search Display..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No Display found.</CommandEmpty>
                    <CommandGroup heading="Display Types">
                      {displays.map((display) => (
                        <CommandItem
                          key={display.value}
                          value={display.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue,
                            );
                            setPopoverOpen(false);
                          }}
                        >
                          {display.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === display.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-4">
            {value && (
              <div>
                {(() => {
                  switch (value) {
                    case "waveform":
                      return (
                        <WaveformSettings
                          nodeId={nodeId}
                          initialMediaKey={mediaKey}
                          initialChannel={initialChannel}
                        />
                      );
                    case "notation":
                      return (
                        <NotationSettings
                          nodeId={nodeId}
                          initalAbcKey={abcKey}
                        />
                      );
                    case "video":
                      return (
                        <VideoSettings
                          nodeId={nodeId}
                          initialMediaKey={mediaKey}
                        />
                      );
                    case "fourier":
                      return (
                        <FourierSettings
                          nodeId={nodeId}
                          initialMediaKey={mediaKey}
                          initialChannel={initialChannel}
                        />
                      );
                    case "spectrogram":
                      return (
                        <SpectrogramSettings
                          nodeId={nodeId}
                          initialMediaKey={mediaKey}
                          initialChannel={initialChannel}
                        />
                      );
                    default:
                      return null;
                  }
                })()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContextMenuDialog;
