"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  IconDefinition,
  faDisplay,
  faFileWaveform,
  faChartColumn,
  faChartGantt,
  faCodeFork,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { JSX, useEffect, useState } from "react";
import "./LeftMenu.css";
import AssetManager from "./AssetManager";
import DisplayMenu from "./DisplayMenu";

interface LeftMenuProps {
  smallestSize?: number;
  initialState?: Array<{
    id: number;
    icon: IconDefinition;
    style: React.CSSProperties;
    tabContent: JSX.Element;
  }>;
  onWidthChange?: (width: number) => void;
  worker?: Worker | null;
}

const LeftMenu: React.FC<LeftMenuProps> = ({
  smallestSize = 128,
  worker,
  initialState = [
    {
      id: 1,
      icon: faFileWaveform,
      style: { transform: "rotate(0)" },
      tabContent: <AssetManager worker={worker} />,
    },
    {
      id: 2,
      icon: faDisplay,
      style: { transform: "rotate(0)" },
      tabContent: <DisplayMenu />,
    },
    {
      id: 3,
      icon: faWaveSquare,
      style: { transform: "rotate(0)" },
      tabContent: <div>Waveform View Settings</div>,
    },
    {
      id: 4,
      icon: faChartColumn,
      tabContent: <div>Fourier View Settings</div>,
    },
    {
      id: 5,
      icon: faChartGantt,
      tabContent: <div>Spectrogram View Settings</div>,
    },
    {
      id: 6,
      icon: faCodeFork,
      style: { transform: "rotate(90deg)" },
      tabContent: <div>Audio Channel Settings</div>,
    },
  ],
  onWidthChange,
}) => {
  const [width, setWidth] = useState(256);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [mouseDown, setMouseDown] = useState(false);
  const [widthBeforeCollapse, setWidthBeforeCollapse] = useState(256 + 60);

  useEffect(() => {
    onWidthChange(256 + 60);
  }, []);
  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = e.clientX;
    const adjustedWidth = newWidth > smallestSize ? newWidth : 0;
    setWidth(adjustedWidth);
    onWidthChange(adjustedWidth + 60);
    setCollapsed(false);
  };
  const handleTabClick = (id: number) => {
    if (activeTab === id) {
      if (collapsed) {
        setCollapsed(false);
        setWidth(widthBeforeCollapse);
        onWidthChange(widthBeforeCollapse + 60);
      } else {
        setCollapsed(true);
        setWidthBeforeCollapse(width);
        onWidthChange(60);
      }
    } else {
      setCollapsed(false);
      setWidth(widthBeforeCollapse);
      onWidthChange(widthBeforeCollapse + 60);
      setActiveTab(id);
    }
  };
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setMouseDown(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div className="menu-height bg-gray-800 w-14 float-left flex flex-col justify-between">
        <ul>
          {initialState.map((item) => (
            <li
              key={item.id}
              className={`icon-button  icon-button:hover ${activeTab === item.id && !collapsed ? "active" : ""}`}
              onClick={() => handleTabClick(item.id)}
            >
              <FontAwesomeIcon
                style={item.style}
                className={`w-6 h-6 ${activeTab === item.id && !collapsed ? "offset-margin" : "m-4"}`}
                icon={item.icon}
              />
            </li>
          ))}{" "}
        </ul>
        <ul className="menu-bottom">
          <li className="icon-button icon-button:hover">
            <FontAwesomeIcon className="w-6 h-6 m-4" icon={faUser} />
          </li>
          <li className="icon-button icon-button:hover">
            <FontAwesomeIcon className="w-6 h-6 m-4" icon={faGear} />
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
        {width > smallestSize && !collapsed ? (
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
            width: width > smallestSize ? "0px" : "0px",
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
