"use client";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Command, CommandGroup, CommandItem, CommandShortcut } from "@/components/ui/command-header";
import { Command as CommandPrimitive } from "cmdk";
import { ABCAsset, addAbc } from "@/store/project-slice";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

interface CommandDialogProps {
  sidebarWidth: number;
  height: number;
  width: number;
}

const CommandHeader: React.FC<CommandDialogProps> = ({
  sidebarWidth,
  height,
  width,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const commandRef = useRef<typeof CommandPrimitive>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
    const handleNewFile = (name?: string) => {
      commandRef.current.value = "";
      const abc: ABCAsset = {
        name: name || "untitled.abc",
        abc: "",
        id: uuidv4(),
        timingCallback: null,
        characterSelection: null,
      };
      dispatch(addAbc(abc));
    };
  return (
    <>
      <Command
        ref={commandRef}
        style={{ left: sidebarWidth + width / 2 - 225 }}
        className="absolute rounded-lg border shadow-md max-w-[450px] w-full z-10"
        openOrHovered={open || hovered}
        hovered={hovered}
        open={open}
        setOpen={setOpen}
        setHovered={setHovered}
      >
        <CommandGroup heading={""}>
          <CommandItem onSelect={(value) => {handleNewFile(); setOpen(false);}}>
            New File
            <CommandShortcut>CTRL + N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        </Command>
      <div style={{ height, width }}></div>
    </>
  );
};

export default CommandHeader;
