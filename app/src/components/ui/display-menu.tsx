"use client";

import * as React from "react";
import { DisplaySelector } from "@/components/ui/display-selector";
import { Sidebar } from "@/components/ui/sidebar";
export function DisplayMenu() {
  
  return (
    <div className="flex flex-col flex-1 m-2">
      <DisplaySelector />
    </div>
  );
}
