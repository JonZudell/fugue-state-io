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

const NotationSettings: React.FC<{
  nodeId: string | null;
  initalAbcKey: string | null;
}> = ({ nodeId, initalAbcKey }) => {
  const dispatch = useDispatch();
  const { abcs } = useSelector(selectProject);
  const [mediaPopoverOpen, setMediaPopoverOpen] = useState<boolean>(false);
  const [abcKey, setAbcKey] = useState<string>(
    initalAbcKey ? initalAbcKey : "",
  );
  const [errors, setErrors] = useState<string[]>([]);

  const submit = useCallback(() => {
    if (!abcKey) {
      setErrors(["Please select an abc file."]);
      return;
    }
    if (nodeId === "root") {
      dispatch(
        setRoot({
          id: nodeId,
          type: "notation",
          sourceId: abcKey,
        }),
      );
    } else {
      dispatch(
        setNode({
          nodeId: nodeId,
          node: {
            id: nodeId,
            type: "notation",
            sourceId: abcKey,
          },
        }),
      );
    }
  }, [abcKey, nodeId, dispatch]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex space-x-4">
          <p className="text-sm text-muted-foreground my-2 space-xl-4">ABC Notation</p>
          <Popover open={mediaPopoverOpen} onOpenChange={setMediaPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={mediaPopoverOpen}
                className="w-[300px] justify-between"
              >
                {abcKey ? abcs[abcKey].name : "Select Media File..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 flex">
              <Command>
                <CommandInput
                  placeholder="Select ABC File..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>CTRL + N to create New File </CommandEmpty>
                  <CommandGroup heading="ABC Files">
                    {Object.keys(abcs).map((abcId) => {
                      const abc = abcs[abcId];
                      return (
                        <CommandItem
                          key={abc.id}
                          value={abc.id}
                          onSelect={(currentValue) => {
                            setAbcKey(
                              currentValue === abcKey ? "" : currentValue,
                            );
                            setMediaPopoverOpen(false);
                          }}
                        >
                          {abc.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              abcKey === abc.id
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
export default NotationSettings;
