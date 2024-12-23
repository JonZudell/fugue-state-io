"use client";
import { useState, useEffect, useRef } from "react";
import "./SpanSlider.css";
interface SpanSliderProps {
  className?: string;
}

const SpanSlider: React.FC<SpanSliderProps> = ({ className }) => {
  const spanSliderRef = useRef<HTMLDivElement>(null);
  const [spanSliderWidth, setSpanSliderWidth] = useState(0);
  useEffect(() => {
    if (spanSliderRef.current) {
      const width = spanSliderRef.current.offsetWidth;
      console.log("Span slider width:", width);
      setSpanSliderWidth(width);
      setThumb2Value(width - 10);
    }
  }, []);
  const [thumb1Value, setThumb1Value] = useState(0);
  const [thumb2Value, setThumb2Value] = useState(0);

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

  return (
    <div className={`span-slider ${className}`} ref={spanSliderRef}>
      <div className="span-slider__track">
        {/* <div
          className="span-slider__before"
          style={{ position: "absolute", left: "0px", width: `${thumb1Value}px` }}
        ></div> */}
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
        {/* <div
          className="span-slider__between"
          style={{
            position: "absolute",
            left: `${thumb1Value}px`,
            width: `${(thumb2Value - thumb1Value)}px`,
          }}
        ></div> */}
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
        {/* <div
          className="span-slider__after"
          style={{
            position: "absolute",
            left: `${thumb1Value}px`,
            width: `${(100 - thumb2Value) / 100 * spanSliderWidth}px`,
          }}
        ></div> */}
      </div>
    </div>
  );
};

export default SpanSlider;
