"use client";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import "./span-slider.css";
import { selectLooping } from "@/store/playback-slice";
import { useSelector } from "react-redux";
interface SpanSliderProps {
  className?: string;
  callback?: (start: number, finish: number) => void;
  width?: number;
  enabled?: boolean;
}

const SpanSlider: React.FC<SpanSliderProps> = ({
  className,
  callback,
  enabled,
}) => {
  const spanSliderRef = useRef<HTMLDivElement>(null);
  const [thumb1Value, setThumb1Value] = useState(0);
  const [thumb2Value, setThumb2Value] = useState(100);
  const [width, setWidth] = useState(0);
  const looping = useSelector(selectLooping);

  useLayoutEffect(() => {
    if (spanSliderRef.current) {
      setWidth(spanSliderRef.current.clientWidth);
    }
  }, [spanSliderRef.current?.clientWidth]);
  useEffect(() => {
    if (spanSliderRef.current) {
      setThumb1Value((prev) => Math.min(Math.max(prev, 0), 100));
      setThumb2Value((prev) => Math.min(Math.max(prev, 0), 100));
    }
  }, [thumb1Value, thumb2Value]);

  useEffect(() => {
    if (callback && spanSliderRef.current) {
      callback(
        ((thumb1Value / 100) * (spanSliderRef.current.clientWidth - 10)) /
          (spanSliderRef.current.clientWidth - 10),
        ((thumb2Value / 100) * (spanSliderRef.current.clientWidth - 10)) /
          (spanSliderRef.current.clientWidth - 10),
      );
    }
  }, [thumb1Value, thumb2Value, callback, looping]);

  const handleThumb1Drag = (e: MouseEvent) => {
    if (!enabled) return;
    if (spanSliderRef.current) {
      const rect = spanSliderRef.current.getBoundingClientRect();
      const newValue = ((e.clientX - rect.left) / (rect.width - 10)) * 100;
      setThumb1Value(Math.min(Math.max(newValue, 0), 100));
    }
  };

  const handleThumb2Drag = (e: MouseEvent) => {
    if (!enabled) return;
    if (spanSliderRef.current) {
      const rect = spanSliderRef.current.getBoundingClientRect();
      const newValue = ((e.clientX - rect.left) / (rect.width - 10)) * 100;
      setThumb2Value(Math.min(Math.max(newValue, 0), 100));
    }
  };

  const handleSliderDrag = (e: MouseEvent) => {
    if (!enabled) return;
    if (spanSliderRef.current) {
      const rect = spanSliderRef.current.getBoundingClientRect();
      const newValue = ((e.clientX - rect.left) / (rect.width - 10)) * 100;
      const thumb1 = thumb1Value;
      const thumb2 = thumb2Value;
      const delta = newValue - (thumb1 + (thumb2 - thumb1) / 2);
      const newThumb1Value = Math.min(Math.max(thumb1 + delta, 0), 100);
      const newThumb2Value = Math.min(Math.max(thumb2 + delta, 0), 100);
      setThumb1Value(Math.min(newThumb1Value, newThumb2Value));
      setThumb2Value(Math.max(newThumb1Value, newThumb2Value));
    }
  };

  return (
    <div className={`span-slider ${className}`} ref={spanSliderRef}>
      <div className="span-slider__track">
        <div
          className="span-slider__thumb_1"
          style={{
            position: "absolute",
            left: `${(thumb1Value / 100) * (width - 10)}px`,
            cursor: enabled ? "ew-resize" : "not-allowed",
          }}
          onMouseDown={(e) => {
            if (!enabled) return;
            e.preventDefault();
            document.addEventListener("mousemove", handleThumb1Drag);
            document.addEventListener(
              "mouseup",
              () => {
                document.removeEventListener("mousemove", handleThumb1Drag);
              },
              { once: true },
            );
          }}
        ></div>
        <div
          className="span-slider__between"
          style={{
            position: "absolute",
            left: `${(Math.min(thumb1Value, thumb2Value) / 100) * (width - 10)}px`,
            width: `${((Math.max(thumb2Value, thumb1Value) - Math.min(thumb1Value, thumb2Value)) / 100) * (width - 10)}px`,
            cursor: enabled ? "grab" : "not-allowed",
          }}
          onMouseDown={(e) => {
            if (!enabled) return;
            e.preventDefault();
            document.addEventListener("mousemove", handleSliderDrag);
            document.addEventListener(
              "mouseup",
              () => {
                document.removeEventListener("mousemove", handleSliderDrag);
              },
              { once: true },
            );
            e.currentTarget.style.cursor = "grabbing";
          }}
          onMouseUp={(e) => {
            if (!enabled) return;
            e.currentTarget.style.cursor = "grab";
          }}
        ></div>
        <div
          className="span-slider__thumb_2"
          style={{
            position: "absolute",
            left: `${(thumb2Value / 100) * ((spanSliderRef.current?.clientWidth ?? 0) - 10)}px`,
            cursor: enabled ? "ew-resize" : "not-allowed",
          }}
          onMouseDown={(e) => {
            if (!enabled) return;
            e.preventDefault();
            document.addEventListener("mousemove", handleThumb2Drag);
            document.addEventListener(
              "mouseup",
              () => {
                document.removeEventListener("mousemove", handleThumb2Drag);
              },
              { once: true },
            );
          }}
        ></div>
      </div>
    </div>
  );
};

export default SpanSlider;
