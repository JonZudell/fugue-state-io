"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectPlayback } from "@/store/playback-slice";
import { useSelector } from "react-redux";
import { selectProject } from "@/store/project-slice";
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
const WaveformSettings: React.FC = () => {
  const { mediaFiles } = useSelector(selectProject);
  const [ channel, setChannel ] = useState<string>("");
  const [ popoverOpen, setPopoverOpen ] = useState<boolean>(false);
  const [ mediaKey, setMediaKey ] = useState<string>("");

  return (
    <>
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Media</p>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className="w-[300px] justify-between"
          >
            {mediaKey
              ? mediaFiles[mediaKey].name
              : "Select media file..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search Select media file..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup heading="Media Files">
                {Object.keys(mediaFiles).map((mediaId) => {
                  const media = mediaFiles[mediaId];
                  return (
                  <CommandItem
                    key={media.id}
                    value={media.id}
                    onSelect={(currentValue) => {
                    setMediaKey(currentValue === mediaKey ? "" : currentValue);
                    setPopoverOpen(false);
                    }}
                  >
                    {media.name}
                    <Check
                    className={cn(
                      "ml-auto",
                      mediaKey === media.id
                      ? "opacity-100"
                      : "opacity-0",
                    )}
                    />
                  </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
    </>
  )

};
export default WaveformSettings;
