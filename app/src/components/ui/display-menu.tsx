"use client";

import * as React from "react";
import { DisplayList } from "@/components/ui/display-list";
import { DisplayTreeSelect } from "@/components/ui/display-tree-select";
export function DisplayMenu() {
  
  return (
    <div className="flex flex-col flex-1 m-2">
      <DisplayList />
      <DisplayTreeSelect />
    </div>
  );
}
