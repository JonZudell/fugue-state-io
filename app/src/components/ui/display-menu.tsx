"use client";

import * as React from "react";
import { DisplayList } from "@/components/ui/display-list";
import { DisplayLayout } from "@/components/ui/display-layout";
export function DisplayMenu() {
  return (
    <div className="flex flex-col flex-1 m-2">
      <DisplayList />
      <DisplayLayout />
    </div>
  );
}
