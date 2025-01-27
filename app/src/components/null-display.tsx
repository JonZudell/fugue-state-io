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
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div style={{ width: width, height: height }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                textAlign: "center",
                color: "gray",
              }}
            >
              No display selected
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setOpen(true)}>
            <span>Add Display</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Display</DialogTitle>
            <DialogDescription>
              Select and configure a new display type.
            </DialogDescription>
          </DialogHeader>{" "}
          <Separator />
          
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">Type</p>
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
                    : "Select framework..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search framework..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup heading="Display Types">
                      {displays.map((display) => (
                        <CommandItem
                          key={display.value}
                          value={display.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue);
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
                      return <WaveformSettings />;
                    case "notation":
                      return <div>Notation settings...</div>;
                    case "video":
                      return <div>Video settings...</div>;
                    case "fourier":
                      return <div>Fourier settings...</div>;
                    case "spectrogram":
                      return <div>Spectrogram settings...</div>;
                    default:
                      return null;
                  }
                })()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NullDisplay;
