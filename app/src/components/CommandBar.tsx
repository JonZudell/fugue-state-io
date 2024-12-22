"use client";
import { useState } from "react";
import "./CommandBar.css";
interface CommandBarProps {
  focused?: false;
}

const CommandBar: React.FC<CommandBarProps> = ({ focused = false }) => {
  const [isFocused, setIsFocused] = useState<boolean>(focused);
  return (
    <div
      className={`command-bar bg-gray-800 items-center border-b-2 border-gray-900 ${focused ? "focused" : ""}`}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <input
        type="text"
        className={`text-gray-900 command-bar__input ${!isFocused ? "text-center" : ""} rounded-sm`}
        placeholder={`${!isFocused ? "(Command Pallette)" : ""}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};
export default CommandBar;
