"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faMusic,
  IconDefinition,
  faDisplay,
  faTimeline,
} from "@fortawesome/free-solid-svg-icons";
import { JSX, useState } from "react";
import "./LeftMenu.css";
import AssetManager from "./AssetManager";

interface LeftMenuProps {
  smallestSize?: number;
  initialState?: Array<{
    id: number;
    icon: IconDefinition;
    style: React.CSSProperties;
    tabContent: JSX.Element;
  }>;
  onWidthChange?: (width: number) => void;
}

const LeftMenu: React.FC<LeftMenuProps> = ({
  smallestSize = 128,
  initialState = [
    {
      id: 1,
      icon: faMusic,
      style: { transform: "rotate(0)" },
      tabContent: <AssetManager />,
    },
    {
      id: 2,
      icon: faDisplay,
      style: { transform: "rotate(0)" },
      tabContent: <div>Display</div>,
    },
    {
      id: 3,
      icon: faTimeline,
      style: { transform: "rotate(0)" },
      tabContent: <div>Timeline</div>,
    },
  ],
  onWidthChange,
}) => {
  const [width, setWidth] = useState(256);
  const [activeTab, setActiveTab] = useState(1);
  const [mouseDown, setMouseDown] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = e.clientX;
    const adjustedWidth = newWidth > smallestSize ? newWidth : 0;
    setWidth(adjustedWidth);
    if (onWidthChange) {
      const totalWidth = newWidth > smallestSize ? newWidth + 74 : 68;
      onWidthChange(totalWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setMouseDown(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTabClick = (id: number) => {
    setActiveTab(id);
  };
  return (
    <>
      <div className="menu-height bg-gray-800 w-16 float-left flex flex-col justify-between">
        <ul>
          {initialState.map((item) => (
            <li
              key={item.id}
              className={`icon-button  icon-button:hover ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleTabClick(item.id)}
            >
              <FontAwesomeIcon
                style={item.style}
                className={`w-8 h-8 ${activeTab === item.id ? "offset-margin" : "m-4"}`}
                icon={item.icon}
              />
            </li>
          ))}{" "}
        </ul>
        <ul className="menu-bottom">
          <li className="icon-button icon-button:hover">
            <FontAwesomeIcon className="w-8 h-8 m-4" icon={faUser} />
          </li>
          <li className="icon-button icon-button:hover">
            <FontAwesomeIcon className="w-8 h-8 m-4" icon={faGear} />
          </li>
        </ul>
      </div>
      <div
        style={{ width: "2px" }}
        className={`${width <= smallestSize && mouseDown ? "bg-blue-600" : "bg-gray-600"} h-screen float-left flex flex-col menu-height`}
        onMouseDown={handleMouseDown}
        onDragStart={(e) => e.preventDefault()}
      />
      <div>
        {width > smallestSize ? (
          <div
            style={{ width: `${Math.max(width, smallestSize / 2)}px` }}
            className="drawer bg-gray-800 h-screen float-left flex flex-col justify-between undraggable"
            onDragStart={(e) => e.preventDefault()}
          >
            {initialState[activeTab - 1].tabContent}
          </div>
        ) : null}
        <div
          style={{
            width: width > smallestSize ? "4px" : "0px",
            cursor: "ew-resize",
          }}
          className={`bg-gray-800 h-screen float-left clickable-area menu-height`}
          onMouseDown={handleMouseDown}
          onDragStart={(e) => e.preventDefault()}
        />
        <div
          style={{ width: "2px", cursor: "ew-resize" }}
          className={`h-screen float-left clickable-area ${mouseDown ? "bg-blue-600" : "bg-gray-600 menu-height"}`}
          onMouseDown={handleMouseDown}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    </>
  );
};
export default LeftMenu;
