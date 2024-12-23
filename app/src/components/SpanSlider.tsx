"use client";
import { useState, useEffect, useRef } from "react";
import "./SpanSlider.css";
interface SpanSliderProps {
  className?: string;
  callback?: (start: number, finish: number) => void;
}

const SpanSlider: React.FC<SpanSliderProps> = ({ className, callback }) => {
  const spanSliderRef = useRef<HTMLDivElement>(null);
  const [spanSliderWidth, setSpanSliderWidth] = useState(0);
  useEffect(() => {
    if (spanSliderRef.current) {
      const width = spanSliderRef.current.clientWidth;
      setSpanSliderWidth(width);
      setThumb2Value(width - 10);
    }
  }, []);
  const [thumb1Value, setThumb1Value] = useState(0);
  const [thumb2Value, setThumb2Value] = useState(0);

  useEffect(() => {
    if (callback && spanSliderRef.current) {
      callback(thumb1Value / (spanSliderRef.current.clientWidth) , thumb2Value / (spanSliderRef.current.clientWidth));
    }
  }, [thumb1Value, thumb2Value, callback]);

  const handleThumb1Drag = (e: MouseEvent) => {
    if (spanSliderRef.current) {
      const rect = spanSliderRef.current.getBoundingClientRect();
      const newValue = e.clientX - rect.left;
      setThumb1Value(Math.min(Math.max(newValue, 0), spanSliderWidth - 10));
    }
  };

  const handleThumb2Drag = (e: MouseEvent) => {
    if (spanSliderRef.current) {
      const rect = spanSliderRef.current.getBoundingClientRect();
      const newValue = e.clientX - rect.left;
      setThumb2Value(Math.min(Math.max(newValue, 0), spanSliderWidth - 10));
    }
  };

  const handleSliderDrag = (e: MouseEvent) => {
    if (spanSliderRef.current) {
      const rect = spanSliderRef.current.getBoundingClientRect();
      const newValue = e.clientX - rect.left;
      const thumb1 = thumb1Value;
      const thumb2 = thumb2Value;
      const delta = newValue - (thumb1 + (thumb2 - thumb1) / 2);
      const newThumb1Value = Math.min(Math.max(thumb1 + delta, 0), spanSliderWidth - 10);
      const newThumb2Value = Math.min(Math.max(thumb2 + delta, 0), spanSliderWidth - 10);
      setThumb1Value(Math.min(newThumb1Value, newThumb2Value));
      setThumb2Value(Math.max(newThumb1Value, newThumb2Value));
    }
  };

  return (
    <div className={`span-slider ${className}`} ref={spanSliderRef}>
      <div className="span-slider__track">
        <div
          className="span-slider__thumb_1"
          style={{ position: "absolute", left: `${thumb1Value}px` }}
          onMouseDown={(e) => {
            e.preventDefault();
            document.addEventListener("mousemove", handleThumb1Drag);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", handleThumb1Drag);
            }, { once: true });
          }}
        ></div>
        <div
          className="span-slider__between"
          style={{
            position: "absolute",
            left: `${Math.min(thumb1Value, thumb2Value)}px`,
            width: `${(Math.max(thumb2Value, thumb1Value) - Math.min(thumb1Value, thumb2Value))}px`,
            cursor: "grab",
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            document.addEventListener("mousemove", handleSliderDrag);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", handleSliderDrag);
            }, { once: true });
            e.currentTarget.style.cursor = "grabbing";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.cursor = "grab";
          }}
        ></div>
        <div
          className="span-slider__thumb_2"
          style={{ position: "absolute", left: `${(thumb2Value)}px` }}
          onMouseDown={(e) => {
            e.preventDefault();
            document.addEventListener("mousemove", handleThumb2Drag);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", handleThumb2Drag);
            }, { once: true });
          }}
        ></div>
      </div>
    </div>
  );
};

export default SpanSlider;