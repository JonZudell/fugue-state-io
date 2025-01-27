"use client";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Command } from "@/components/ui/command-header";
import { Command as CommandPrimitive } from "cmdk";

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
      />
      <div style={{ height, width, zIndex: 0 }}></div>
    </>
  );
};

export default CommandHeader;
