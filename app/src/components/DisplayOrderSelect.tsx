"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faChartSimple,
  faVideo,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  selectWaveformEnabled,
  selectVideoEnabled,
  selectFourierEnabled,
  selectSpectrogramEnabled,
  selectLayout,
  setWaveformEnabled,
  setVideoEnabled,
  setFourierEnabled,
  setSpectrogramEnabled,
  setLayout,
  selectOrder,
  setOrder,
} from "../store/display-slice";
import OrderItem from "./OrderItem";

interface DisplayLayoutSelectProps {
  focused?: boolean;
}

const DisplayLayoutSelect: React.FC<DisplayLayoutSelectProps> = ({
  focused = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector(selectOrder);

  const raiseOrder = (
    item: "waveform" | "video" | "spectrogram" | "fourier",
  ) => {
    const index = order.indexOf(item);
    if (index > 0) {
      const newOrder = [...order];
      newOrder.splice(index, 1);
      newOrder.splice(index - 1, 0, item);
      dispatch(setOrder(newOrder));
    }
  };
  const lowerOrder = (
    item: "waveform" | "video" | "spectrogram" | "fourier",
  ) => {
    const index = order.indexOf(item);
    if (index <= order.length - 2) {
      const newOrder = [...order];
      newOrder.splice(index, 1);
      newOrder.splice(index + 1, 0, item);
      dispatch(setOrder(newOrder));
    }
  };
  return (
    <div className={`flex flex-col`}>
      {order.map((item, index) => (
        <div key={index} className="flex  mb-2">
          <OrderItem
            first={index === 0}
            last={index === order.length - 1}
            item={item}
            lowerCallback={() => {
              lowerOrder(item);
            }}
            raiseCallback={() => raiseOrder(item)}
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayLayoutSelect;
