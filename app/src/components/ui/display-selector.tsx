"use client";

import * as React from "react";
import { DisplayItem } from "./display-item";
import { appendToComponentTree, selectRoot, ComponentTree } from "@/store/displaySlice";
import { useSelector, useDispatch } from "react-redux";

function recurseTree(node: ComponentTree, path: number[]): ComponentTree[] {
  console.log(path, node);
  // Base case: if the node has no components, return the current node
  if ((!node.components || node.components.length === 0) && node.type !== "root" && node.type !== "display") {
    return [node];
  }

  // Initialize an array to accumulate nodes
  let accumulatedNodes: ComponentTree[] = node.type != "display" && node.type != "root" ? [node] : [];

  // Recursively traverse each component
  for (let i = 0; i < node.components.length; i++) {
    const childNode = node.components[i] as ComponentTree;
    const pathCopy = path.slice();
    pathCopy.push(i);
    if (childNode) {
      accumulatedNodes = accumulatedNodes.concat(recurseTree(childNode, pathCopy));
    }
  }
  console.log(accumulatedNodes);
  return accumulatedNodes;
}
export function DisplaySelector() {
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
