"use client";

import * as React from "react";
import { DisplayItem } from "./display-item";
import { appendToComponentTree, selectRoot, ComponentTree } from "@/store/displaySlice";
import { useSelector, useDispatch } from "react-redux";
import { recurseTree } from "@/lib/tree";



export function DisplayList() {
  const displayOptions = ["waveform", "spectrogram", "fourier"];

  const root = useSelector(selectRoot);
  const dispatch = useDispatch();
  const addDisplay = (value: string) => {
    dispatch(appendToComponentTree(<div></div>));
  };
  return (
    <div className="flex flex-col flex-1">
        {recurseTree(root, []).map((componentTree, index) => (
          <DisplayItem
            key={index}
            values={displayOptions}
            placeholder={"Select Display Type"}
            empty={"Select Display Type"}
          />
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
