"use client";

import * as React from "react";
import { recurseTree } from "@/lib/tree";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectRoot } from "@/store/displaySlice";

export function DisplayTreeSelect() {
  const root = useSelector(selectRoot) as ComponentTree;
  const [count, setCount] = useState(recurseTree(root, []).length);
  useEffect(() => {
    setCount(recurseTree(root, []).length);
  }, [root]);
  return (
    <div className="flex flex-col flex-1 m-2">
      Select View
      {count}
    </div>
  );
}
