"use client";

import {
  ABCAsset,
  MediaFile,
  selectPlayback,
  selectProject,
  setMediaMode,
  setMediaOffset,
  setMediaVolume,
  setNotationOffset,
  setPrimarySourceId,
  setReferenceFile,
} from "@/store/project-slice";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
interface SidebarNotationItemProps {
  className?: string;
  abcFile: ABCAsset;
}

export function SidebarNotationItem({
  className,
  abcFile,
}: SidebarNotationItemProps) {
  const { referenceFile } = useSelector(selectProject);
  const [isPrimary, setIsPrimary] = useState(referenceFile === abcFile.id);
  const [offsetError, setOffsetError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsPrimary(referenceFile === abcFile.id);
  }, [referenceFile]);

  const updatePrimary = (value: boolean) => {
    console.log("updatePrimary", value);
    if (referenceFile !== abcFile.id) {
      dispatch(setReferenceFile({ id: abcFile.id }));
    } else {
      dispatch(setReferenceFile({ id: null }));
    }
  };
  const updateOffset = (value: string) => {
    if (!isNaN(parseFloat(value))) {
      dispatch(
        setNotationOffset({ id: abcFile.id, offset: parseFloat(value) }),
      );
      setOffsetError(false);
    } else {
      setOffsetError(true);
    }
  };
  return (
    <Card
      className={`flex flex-col flex-1 mx-auto text-white p-2 text-sm w-full ${className}`}
      style={{ overflow: "hidden" }}
    >
      {abcFile.name}
      <div className="flex items-center space-x-2">
        <Switch
          id="set-primary"
          checked={isPrimary}
          onCheckedChange={(event) => {
            updatePrimary(event);
          }}
        />
        <Label htmlFor="set-primary">Set As Reference File</Label>
      </div>
      <Label className="py-2">Offset</Label>
      <Input
        step="0.1"
        className={`py-2 ${offsetError ? "border-red-500" : "border-white"}`}
        type="number"
        defaultValue={abcFile.offset}
        onChange={(event: any) => {
          updateOffset(event.target.value);
        }}
      />
    </Card>
  );
}
export default SidebarNotationItem;
