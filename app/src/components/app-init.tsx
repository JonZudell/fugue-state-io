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
          <CardDescription className="text-lg">Login</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
          <div className="flex items-center justify-center gap-2 mt-6">
            <h3>--or--</h3>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            <h3>Demo without an account!</h3>
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
