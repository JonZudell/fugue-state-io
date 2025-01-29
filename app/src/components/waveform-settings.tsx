"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectPlayback } from "@/store/playback-slice";
import { useDispatch, useSelector } from "react-redux";
import { selectProject } from "@/store/project-slice";
import { setRoot } from "@/store/display-slice";
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
import { DialogFooter } from "./ui/dialog";
import WaveformDisplay from "./waveform-display";
import { init } from "next/dist/compiled/webpack/webpack";
const WaveformSettings: React.FC<{ nodeId: string | null, initialMediaKey: string | null, initialChannel: string | null }> = ({nodeId, initialMediaKey, initialChannel}) => {
  const dispatch = useDispatch();
  const { mediaFiles } = useSelector(selectProject);
  const [channel, setChannel] = useState<string>(initialChannel ? initialChannel : "");
  const [channelPopoverOpen, setChannelPopoverOpen] = useState<boolean>(false);
  const [mediaPopoverOpen, setMediaPopoverOpen] = useState<boolean>(false);
  const [mediaKey, setMediaKey] = useState<string>(initialMediaKey ? initialMediaKey : "");
  const [errors, setErrors] = useState<string[]>([]);

  const submit = useCallback(() => {
    if (!mediaKey) {
      setErrors(["Please select a media file."]);
      return;
    }
    if (!channel) {
      setErrors(["Please select a channel."]);
      return;
    }
    dispatch(
      setRoot({
        id: "root",
        type: "waveform",
        sourceId: mediaKey,
        channel: channel,
      }),
    );
  }, [mediaKey, channel]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex space-x-4">
          <p className="text-sm text-muted-foreground my-2 space-xl-4">Media</p>
          <Popover open={mediaPopoverOpen} onOpenChange={setMediaPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={mediaPopoverOpen}
                className="w-[300px] justify-between"
              >
                {mediaKey ? mediaFiles[mediaKey].name : "Select Media File..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 flex">
              <Command>
                <CommandInput
                  placeholder="Search Select Media File..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No Media Files found.</CommandEmpty>
                  <CommandGroup heading="Media Files">
                    {Object.keys(mediaFiles).map((mediaId) => {
                      const media = mediaFiles[mediaId];
                      return (
                        <CommandItem
                          key={media.id}
                          value={media.id}
                          onSelect={(currentValue) => {
                            setMediaKey(
                              currentValue === mediaKey ? "" : currentValue,
                            );
                            setMediaPopoverOpen(false);
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

        {mediaKey && (
          <div className="flex mt-2">
            <p className="text-sm text-muted-foreground my-2 mr-2">Channel</p>
            <Popover
              open={channelPopoverOpen}
              onOpenChange={setChannelPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={channelPopoverOpen}
                  className="w-[300px] justify-between"
                >
                  {channel ? channel : "Select channel..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0 flex">
                <Command>
                  <CommandInput
                    placeholder="Search Select channel..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No channel found.</CommandEmpty>
                    <CommandGroup heading="Channels">
                      {Object.keys(mediaFiles[mediaKey].summary).map(
                        (channelKey) => {
                          return (
                            <CommandItem
                              key={channelKey}
                              value={channelKey}
                              onSelect={(currentValue) => {
                                setChannel(
                                  currentValue === channel ? "" : currentValue,
                                );
                                setChannelPopoverOpen(false);
                              }}
                            >
                              {channelKey}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  channelKey === channel
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          );
                        },
                      )}
                      <CommandItem
                        key="left + right"
                        value="left + right"
                        onSelect={(currentValue) => {
                          setChannel(
                            currentValue === channel ? "" : currentValue,
                          );
                          setChannelPopoverOpen(false);
                        }}
                      >
                        {"left + right"}
                        <Check
                          className={cn(
                            "ml-auto",
                            "left + right" === channel
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
        <DialogFooter>
          <Button onClick={submit} type="submit">
            Confirm
          </Button>
        </DialogFooter>
      </div>
    </>
  );
};
export default WaveformSettings;
