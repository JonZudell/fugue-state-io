"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faChartColumn,
  faChartGantt,
  faChartSimple,
  faVideo,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";

interface OrderItemProps {
  item: "waveform" | "video" | "spectrogram" | "fourier";
  first: boolean;
  last: boolean;
  raiseCallback: (item) => void;
  lowerCallback: (item) => void;
}

const IconMap = {
  waveform: faWaveSquare,
  video: faVideo,
  fourier: faChartColumn,
  spectrogram: faChartGantt,
};

const OrderItem: React.FC<OrderItemProps> = ({
  first,
  last,
  item,
  raiseCallback,
  lowerCallback,
}) => {
  return (
    <div className="flex items-center mr-2">
      <FontAwesomeIcon icon={IconMap[item]} className="mr-2 w-4 h-4" />
      <button
        onClick={() => {
          raiseCallback(item);
        }}
        className={`ml-2 p-1 rounded ${first ? "bg-gray-300 text-gray-700" : "bg-blue-500 text-white"}`}
        disabled={first}
      >
        Raise
      </button>
      <button
        onClick={() => {
          lowerCallback(item);
        }}
        className={`ml-2 p-1 rounded ${last ? "bg-gray-300 text-gray-700" : "bg-red-500 text-white"}`}
        disabled={last}
      >
        Lower
      </button>
    </div>
  );
};

export default OrderItem;
