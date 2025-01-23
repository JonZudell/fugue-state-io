"use client";
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import "./slider.css";
import {
  selectLoopEnd,
  selectLoopStart,
  selectMedia,
  selectPlaying,
  selectTimeElapsed,
  setPlaying,
  setTimeElapsed,
} from "@/store/playback-slice";
import { useDispatch, useSelector } from "react-redux";
interface SpanSliderProps {
  className?: string;
}

const SpanSlider: React.FC<SpanSliderProps> = ({ className }) => {
  const spanSliderRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [width, setWidth] = useState(0);
  const timeElapsed = useSelector(selectTimeElapsed);
  const loopStart = useSelector(selectLoopStart);
  const loopEnd = useSelector(selectLoopEnd);
  const media = useSelector(selectMedia);
  const playing = useSelector(selectPlaying);
  const isDraggingRef = useRef<boolean>(false);
  const isPlayingBeforeDragRef = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (spanSliderRef.current) {
      setWidth(spanSliderRef.current.clientWidth);
    }
  }, [spanSliderRef.current?.clientWidth]);

  const handleThumb1Drag = (e: MouseEvent) => {
    if (spanSliderRef.current && media) {
      const rect = spanSliderRef.current.getBoundingClientRect();
      let newValue =
        ((e.clientX - rect.left) / (rect.width - 10)) * media.duration;
      if (loopStart !== null && loopEnd !== null) {
        newValue = Math.max(
          loopStart * media.duration,
          Math.min(newValue, loopEnd * media.duration),
        );
      }
      dispatch(setTimeElapsed(newValue));
    }
  };
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dispatch(setPlaying(isPlayingBeforeDragRef.current));
    document.removeEventListener("mousemove", handleThumb1Drag);
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = spanSliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newValue =
      ((e.clientX - rect.left) / (rect.width - 10)) * media.duration;
    dispatch(setTimeElapsed(newValue));
    document.addEventListener("mousemove", handleThumb1Drag);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
    isDraggingRef.current = true;
    isPlayingBeforeDragRef.current = playing;
    dispatch(setPlaying(false));
  };

  return (
    <div className={`span-slider ${className}`} ref={spanSliderRef}>
      <div
        className="span-slider__track"
        onMouseDown={(e) => {
          handleMouseDown(e);
        }}
      >
        <div
          className="span-slider__before"
          style={{
            position: "absolute",
            width: `${(timeElapsed / media.duration) * (width - 10)}px`,
            cursor: "grab",
          }}
        ></div>
        <div
          className="span-slider__thumb_1"
          style={{
            position: "absolute",
            left: `${(timeElapsed / media.duration) * (width - 10)}px`,
            cursor: "ew-resize",
          }}
          // onMouseDown={(e) => {
          //   e.preventDefault();
          //   document.addEventListener("mousemove", handleThumb1Drag);
          //   document.addEventListener(
          //     "mouseup",
          //     () => {
          //       document.removeEventListener("mousemove", handleThumb1Drag);
          //     },
          //     { once: true },
          //   );
          // }}
        ></div>
      </div>
    </div>
  );
};

export default SpanSlider;
