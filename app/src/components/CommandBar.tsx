"use client";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectControlDown,
  setIsCommandFocused,
  selectIsCommandFocused,
  selectEscDown,
  selectKDown,
} from "@/store/commandSlice";
import CommandDropdown from "@/components/CommandDrowndown";
interface CommandBarProps {
  workspaceWidth: number;
  leftMenuWidth: number;
}
const CommandBar: React.FC<CommandBarProps> = ({}) => {
  const dispatch = useDispatch();
  const controlDown = useSelector(selectControlDown);
  const isCommandFocused = useSelector(selectIsCommandFocused);
  const escDown = useSelector(selectEscDown);
  const kDown = useSelector(selectKDown);
  const [commandInputWidth, setCommandInputWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (inputRef.current) {
        setCommandInputWidth(inputRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (controlDown && kDown) {
      inputRef.current?.focus();
    }
  }, [kDown, controlDown]);

  useEffect(() => {
    if (isCommandFocused && escDown) {
      inputRef.current?.blur();
    }
  }, [escDown, isCommandFocused]);

  return (
    <div>
      <div
        className={`command-bar bg-gray-800 items-center border-b-2 border-gray-900`}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <input
          ref={inputRef}
          type="text"
          className={`text-gray-900 command-bar__input w-3/4 md:w-1/2 xl-2:w-1/4 px-4`}
          placeholder="Type a command..."
          onFocus={() => dispatch(setIsCommandFocused(true))}
          onBlur={() => dispatch(setIsCommandFocused(false))}
        />
      </div>
      {isCommandFocused && <CommandDropdown width={commandInputWidth} />}
    </div>
  );
};
export default CommandBar;
