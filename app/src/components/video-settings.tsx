"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectPlayback } from "@/store/playback-slice";
import { useDispatch, useSelector } from "react-redux";
import { selectProject } from "@/store/project-slice";
import { setNode, setRoot } from "@/store/display-slice";
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

const VideoSettings: React.FC<{
  nodeId: string | null;
  initialMediaKey: string | null;
}> = ({ nodeId, initialMediaKey }) => {
  const dispatch = useDispatch();
  const { mediaFiles } = useSelector(selectProject);
  const [mediaPopoverOpen, setMediaPopoverOpen] = useState<boolean>(true);
  const [mediaKey, setMediaKey] = useState<string>(
    initialMediaKey ? initialMediaKey : "",
  );
  const [errors, setErrors] = useState<string[]>([]);

  const submit = useCallback(() => {
    if (!mediaKey) {
      setErrors(["Please select a media file."]);
      return;
    }
    if (nodeId === "root") {
      dispatch(
        setRoot({
          id: nodeId,
          type: "video",
          sourceId: mediaKey,
        }),
      );
    } else {
      dispatch(
        setNode({
          nodeId: nodeId,
          node: {
            id: nodeId,
            type: "video",
            sourceId: mediaKey,
          },
        }),
      );
    }
  }, [mediaKey]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex space-x-4">
          <p className="text-sm text-muted-foreground my-2 space-xl-4">Video</p>
          <Popover open={mediaPopoverOpen} onOpenChange={setMediaPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={mediaPopoverOpen}
                className="w-[300px] justify-between"
              >
                {mediaKey ? mediaFiles[mediaKey].name : "Select Video File..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 flex">
              <Command>
                <CommandInput
                  placeholder="Search Select Video File..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No Video Files found.</CommandEmpty>
                  <CommandGroup heading="Video Files">
                    {Object.keys(mediaFiles).map((mediaId) => {
                      const media = mediaFiles[mediaId];
                      if (!media.fileType.startsWith("video")) return null;
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
        <DialogFooter>
          <Button onClick={submit} type="submit">
            Confirm
          </Button>
        </DialogFooter>
      </div>
    </>
  );
};
export default VideoSettings;
