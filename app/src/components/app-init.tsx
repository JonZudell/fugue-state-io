"use client";
import { uploadFile } from "@/store/project-slice";
import { AppDispatch } from "@/store";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileInput } from "lucide-react";
interface AppInitProps {
  worker: Worker;
  className?: string;
}

const AppInit: React.FC<AppInitProps> = ({ worker, className }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files) {
        Array.from(files).forEach(async (file) => {
          dispatch(uploadFile({ file, worker }));
        });
      }
    };
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("drop", handleDrop);
    };
  }, [dispatch]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        dispatch(uploadFile({ file, worker }));
      });
    }
  };
  return (
    <div
      className="scrim flex"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Card className={cn("w-96", className)}>
        <CardHeader>
          <CardTitle className="text-2xl text-center">fugue-state.io</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-xl">
            <p>Demo</p>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            <p>Upload a Video or Audio File</p>
          </div>
          <div
            className="upload-placeholder"
            style={{
              border: "2px dashed #ccc",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <FileInput />
            </div>
            <p className="unselectable">Drag to upload file!</p>
            <p className="unselectable">-or-</p>
            <input
              type="file"
              onChange={handleFileUpload}
              className="upload-button text-gray-400"
              multiple
              style={{ display: "none" }}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-500 unselectable"
            >
              Click to upload!
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppInit;
