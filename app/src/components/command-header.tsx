"use client";
import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command-header";
import { Command as CommandPrimitive } from "cmdk";
import { ABCAsset, addAbc } from "@/store/project-slice";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { toggleEditor } from "@/store/display-slice";

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
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const commandRef = useRef<typeof CommandPrimitive>(null);
  const { open, toggleSidebar } = useSidebar();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
      if (e.key === "e" && e.ctrlKey) {
        e.preventDefault();
        dispatch(toggleEditor());
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const handleNewFile = (name?: string) => {
    if (!commandRef.current) return;
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
      <SidebarTrigger
        className={`text-white absolute size-8 cursor-pointer ${open ? "m-4 text-green-500" : "m-2"}`}
      />
      <Command
        ref={commandRef}
        style={{ left: sidebarWidth + width / 2 - 225 }}
        className="absolute rounded-lg border shadow-md max-w-[450px] w-full z-10"
        openOrHovered={isOpen || hovered}
        hovered={hovered}
        open={isOpen}
        setOpen={setIsOpen}
        setHovered={setHovered}
      >
        <CommandGroup heading={""}>
          <CommandItem
            onSelect={(value) => {
              handleNewFile();
              setIsOpen(false);
            }}
          >
            New File
            <CommandShortcut>CTRL + N</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              toggleSidebar();
              setIsOpen(false);
            }}
          >
            Toggle Sidebar
            <CommandShortcut>CTRL + B</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              dispatch(toggleEditor());
              setIsOpen(false);
            }}
          >
            Toggle Editor
            <CommandShortcut>CTRL + E</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </Command>

      <div style={{ height, width }}></div>
    </>
  );
};

export default CommandHeader;
