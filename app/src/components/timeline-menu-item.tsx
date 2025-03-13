"use client";

import { MediaFile, selectPlayback, selectProject, setMediaMode, setMediaOffset, setMediaVolume, setPrimarySourceId } from "@/store/project-slice";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
interface TimelineMenuItemProps {
  className?: string;
  mediaFile: MediaFile;
}

export function TimelineMenuItem({ className, mediaFile }: TimelineMenuItemProps) {
  const [volume, setVolume] = useState(mediaFile.volume);
  const [mode, setMode] = useState(mediaFile.stereo ? 'L/R' : 'L+R');
  const { primarySourceId } = useSelector(selectPlayback);
  const [isPrimary, setIsPrimary] = useState(primarySourceId === mediaFile.id);
  const [offsetError, setOffsetError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMediaVolume({ id: mediaFile.id, volume }));
  }, [volume]);
  useEffect(() => {
    setIsPrimary(primarySourceId === mediaFile.id);
  }, [primarySourceId]);
  useEffect(() => {
    dispatch(setMediaMode({ id: mediaFile.id, mode }));
  }, [mode]);
  const updatePrimary = (value: boolean) => {
    console.log("updatePrimary", value);
    if (primarySourceId !== mediaFile.id) {
      dispatch(setPrimarySourceId(mediaFile.id));
    }
  };
  const updateOffset = (value: string) => {
    if (!isNaN(parseFloat(value))) {
      dispatch(setMediaOffset({ id: mediaFile.id, offset: parseFloat(value) }));
      setOffsetError(false);
    } else {
      setOffsetError(true);
    }
  };
  return (
    <Card className={`flex flex-col flex-1 mx-auto text-white p-2 text-sm ${className}`} style={{ overflow: "hidden" }}>
      {mediaFile.name}
      {mediaFile.stereo ? (
        <Tabs className="text-xs py-2" defaultValue="L/R" onValueChange={(value) => { setMode(value) }}>
          <TabsList>
            <TabsTrigger value="L/R">L/R</TabsTrigger>
            <TabsTrigger value="L+R">L+R</TabsTrigger>
            <TabsTrigger value="L-R">L-R</TabsTrigger>
            <TabsTrigger value="L">L</TabsTrigger>
            <TabsTrigger value="R">R</TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        <Tabs className="text-xs py-2" defaultValue="L+R" onValueChange={(value) => { setMode(value) }}>
          <TabsList>
        <TabsTrigger value="L+R">Mono</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
            <div className="flex items-center space-x-2">
      <Switch id="set-primary" checked={isPrimary}      onCheckedChange={(event) => {
        console.log(event);
        updatePrimary(event);
      }} />

      <Label htmlFor="set-primary">Set Primary Media</Label>
    </div>
      <Label className="py-2">Offset</Label>
      <Input step="0.1" className={`py-2 ${offsetError ? "border-red-500" : "border-white"}`} type="number" defaultValue={mediaFile.offset} onChange={(event: any) => { updateOffset(event.target.value)}} />
      <Label className="py-2">Volume</Label>
      <Slider style={{overflow: "visible"}} className="" defaultValue={[mediaFile.volume]} max={1} min={0} step={0.01} onValueChange={(volume: any) => {console.log(volume); setMediaVolume({id: mediaFile.id, volume: volume[0]})}} />
    </Card>
  );
}
export default TimelineMenuItem;