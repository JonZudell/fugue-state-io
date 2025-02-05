"use client";

import * as React from "react";
import { DisplayItem } from "@/components/ui/display-item";
import { selectDisplay, setOrder } from "@/store/display-slice";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";

export function DisplayList() {
  const displayOptions = [
    "waveform",
    "spectrogram",
    "fourier",
    "none",
    "video",
    "notation",
  ];
  const dispatch = useDispatch();
  const { order } = useSelector(selectDisplay);
  const addDisplay = (
    type: "waveform" | "fourier" | "spectrogram" | "video",
  ) => {
    dispatch(setOrder([...order, type]));
  };
  const onChange = (
    value: "waveform" | "fourier" | "spectrogram" | "video",
    index: number,
  ) => {
    const newOrder = [...order];
    newOrder[index] = value;
    dispatch(setOrder(newOrder));
  };
  const removeDisplay = (index: number) => {
    const newOrder = [...order];
    newOrder.splice(index, 1);
    dispatch(setOrder(newOrder));
  };
  const moveDisplay = (index: number, direction: number) => {
    const newOrder = [...order];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newOrder.length) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[newIndex];
      newOrder[newIndex] = temp;
      dispatch(setOrder(newOrder));
    }
  };
  return (
    <div className="flex flex-col flex-1">
      {order.map((type, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col flex-1">
            <DisplayItem
              values={displayOptions}
              value={type}
              onChange={(value) =>
                onChange(
                  value as "waveform" | "fourier" | "spectrogram" | "video",
                  index,
                )
              }
              placeholder={"Select Display Type"}
              empty={"Select Display Type"}
            />
            <div className="flex justify-between">
              <Button
                className="mt-2 justify-between border border-black w-1/3 mr-1"
                variant={"default"}
                role={"button"}
                onClick={() => moveDisplay(index, -1)}
                disabled={index === 0}
              >
                <ChevronUp />
              </Button>
              <Button
                className="mt-2 justify-between border border-black w-1/3 ml-1 mr-1"
                variant={"default"}
                role={"button"}
                onClick={() => moveDisplay(index, 1)}
                disabled={index === order.length - 1}
              >
                <ChevronDown />
              </Button>
              <Button
                className="mt-2 justify-between border border-black w-1/3 ml-1"
                variant={"destructive"}
                role={"button"}
                onClick={() => removeDisplay(index)}
              >
                <Trash />
              </Button>
            </div>
          </div>
        </React.Fragment>
      ))}
      <button
        className="border-2 border-black border-dashed mt-2 rounded"
        onClick={() => addDisplay("waveform")}
      >
        +
      </button>
    </div>
  );
}
