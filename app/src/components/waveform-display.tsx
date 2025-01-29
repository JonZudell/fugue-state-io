"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectPlayback } from "@/store/playback-slice";
import { useDispatch, useSelector } from "react-redux";
import { MediaFile, selectProject } from "@/store/project-slice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import WaveformSettings from "./waveform-settings";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { removeNode } from "@/store/display-slice";
interface WaveformDisplayProps {
  nodeId: string;
  sourceId: string;
  channel?: string;
  startPercentage?: number;
  endPercentage?: number;
  crosshair?: boolean;
  width: number;
  height: number;
}
const displays = [
  {
    value: "waveform",
    label: "Waveform",
  },
  {
    value: "notation",
    label: "Notation",
  },
  {
    value: "video",
    label: "Video",
  },
  {
    value: "fourier",
    label: "Fourier",
  },
  {
    value: "spectrogram",
    label: "Spectrogram",
  },
];
const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  nodeId,
  sourceId,
  channel = "mono",
  startPercentage = 0,
  endPercentage = 100,
  crosshair = true,
  width,
  height,
}) => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { timeElapsed, loopStart, loopEnd } = useSelector(selectPlayback);
  const project = useSelector(selectProject);
  const media = project.mediaFiles[sourceId];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("waveform");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const drawWaveform = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      console.log("drawWaveform");
      if (media && media.summary && canvas) {
        if (!ctx) {
          return;
        }
        console.log("channel cleared");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing

        const { summary } = media;
        if (!summary.mono) {
          return;
        }
        const summaryLength = summary.mono.length;
        const startSample = Math.floor((startPercentage / 100) * summaryLength);
        const endSample = Math.floor((endPercentage / 100) * summaryLength);
        const samplesPerPixel = (endSample - startSample) / canvas.width;
        if (channel === "left + right" && summary.left && summary.right) {
          console.log("drawing left + right");
          for (let i = 0; i < canvas.width; i++) {
            const startIndex = Math.floor(i * samplesPerPixel + startSample);
            const endIndex =
              Math.floor((i + 1) * samplesPerPixel) + startSample + 1;
            const leftSlice = summary.left.slice(startIndex, endIndex);
            const rightSlice = summary.right.slice(startIndex, endIndex);
            const rightMin = Math.min(
              ...rightSlice.map((frame) => frame.value.min),
            );
            const rightMax = Math.max(
              ...rightSlice.map((frame) => frame.value.max),
            );

            const leftMin = Math.min(
              ...leftSlice.map((frame) => frame.value.min),
            );
            const leftMax = Math.max(
              ...leftSlice.map((frame) => frame.value.max),
            );
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(
              i,
              canvas.height / 4 - (leftMax * canvas.height) / 4,
              1,
              ((leftMax - leftMin) * canvas.height) / 4,
            );
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(
              i,
              canvas.height / 4 -
                (rightMax * canvas.height) / 4 +
                canvas.height / 2,
              1,
              ((rightMax - rightMin) * canvas.height) / 4,
            );
          }
        } else if (channel === "left" && summary.left) {
          for (let i = 0; i < canvas.width; i++) {
            const startIndex = Math.floor(i * samplesPerPixel + startSample);
            const endIndex =
              Math.floor((i + 1) * samplesPerPixel) + startSample + 1;
            const leftSlice = summary.left.slice(startIndex, endIndex);
            const leftMin = Math.min(
              ...leftSlice.map((frame) => frame.value.min),
            );
            const leftMax = Math.max(
              ...leftSlice.map((frame) => frame.value.max),
            );
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(
              i,
              canvas.height / 2 - leftMax * canvas.height,
              1,
              (leftMax - leftMin) * canvas.height,
            );
          }
        } else if (channel === "right" && summary.right) {
          for (let i = 0; i < canvas.width; i++) {
            const startIndex = Math.floor(i * samplesPerPixel + startSample);
            const endIndex =
              Math.floor((i + 1) * samplesPerPixel) + startSample + 1;
            const rightSlice = summary.right.slice(startIndex, endIndex);
            const rightMin = Math.min(
              ...rightSlice.map((frame) => frame.value.min),
            );
            const rightMax = Math.max(
              ...rightSlice.map((frame) => frame.value.max),
            );
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(
              i,
              canvas.height / 2 - rightMax * canvas.height,
              1,
              (rightMax - rightMin) * canvas.height,
            );
          }
        } else if (channel === "mono" && summary.mono) {
          console.log("drawing mono");
          for (let i = 0; i < canvas.width; i++) {
            const startIndex = Math.floor(i * samplesPerPixel + startSample);
            const endIndex =
              Math.floor((i + 1) * samplesPerPixel) + startSample + 1;
            const monoSlice = summary.mono.slice(startIndex, endIndex);
            const monoMin = Math.min(
              ...monoSlice.map((frame) => frame.value.min),
            );
            const monoMax = Math.max(
              ...monoSlice.map((frame) => frame.value.max),
            );
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            console.log(monoMax, monoMin);
            ctx.fillRect(
              i,
              canvas.height / 2 - monoMax * canvas.height,
              1,
              (monoMax - monoMin) * canvas.height,
            );
          }
        } else if (channel === "side" && summary.side) {
          for (let i = 0; i < canvas.width; i++) {
            const startIndex = Math.floor(i * samplesPerPixel + startSample);
            const endIndex =
              Math.floor((i + 1) * samplesPerPixel) + startSample + 1;
            const sideSlice = summary.side.slice(startIndex, endIndex);
            const sideMin = Math.min(
              ...sideSlice.map((frame) => frame.value.min),
            );
            const sideMax = Math.max(
              ...sideSlice.map((frame) => frame.value.max),
            );
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillRect(
              i,
              canvas.height / 2 - sideMax * canvas.height,
              1,
              (sideMax - sideMin) * canvas.height,
            );
          }
        }
      }
    },
    [media, startPercentage, endPercentage, channel],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    drawWaveform(canvas, ctx);
  }, [
    drawWaveform,
    timeElapsed,
    channel,
    startPercentage,
    endPercentage,
    media,
    crosshair,
    loopStart,
    loopEnd,
    width,
    height,
  ]);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                backgroundColor: "rgba(0, 0, 0, 0)",
                overflow: "hidden",
              }}
            >
              {crosshair && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${(((timeElapsed / media!.duration) * 100 - startPercentage) / (endPercentage - startPercentage)) * 100}%`,
                    width: "2px",
                    height: "100%",
                    backgroundColor: "blue",
                    zIndex: 100,
                    opacity: 1,
                  }}
                />
              )}
            </div>
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              style={{ width: width + "px", height: height + "px" }}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setOpen(true)}>
            <span>Edit Display Settings</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => {dispatch(removeNode(nodeId)); console.log("removeNode", nodeId)}}>
            <span>Remove Display</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Display</DialogTitle>
            <DialogDescription>
              Select and configure a new display type.
            </DialogDescription>
          </DialogHeader>{" "}
          <Separator />
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">Type</p>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? displays.find((framework) => framework.value === value)
                        ?.label
                    : "Select framework..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search display types..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No Display Types found.</CommandEmpty>
                    <CommandGroup heading="Display Types">
                      {displays.map((display) => (
                        <CommandItem
                          key={display.value}
                          value={display.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue,
                            );
                            setPopoverOpen(false);
                          }}
                        >
                          {display.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === display.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-4">
            {value && (
              <div>
                {(() => {
                  switch (value) {
                    case "waveform":
                      return <WaveformSettings nodeId={nodeId} initialChannel={channel} initialMediaKey={media.id} />;
                    case "notation":
                      return <div>Notation settings...</div>;
                    case "video":
                      return <div>Video settings...</div>;
                    case "fourier":
                      return <div>Fourier settings...</div>;
                    case "spectrogram":
                      return <div>Spectrogram settings...</div>;
                    default:
                      return null;
                  }
                })()}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default WaveformDisplay;
