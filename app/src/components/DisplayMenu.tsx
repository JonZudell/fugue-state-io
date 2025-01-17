"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faChartBar,
  faChartColumn,
  faChartGantt,
  faChartSimple,
  faVideo,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import {
  selectWaveformEnabled,
  selectVideoEnabled,
  selectFourierEnabled,
  selectSpectrogramEnabled,
  selectLayout,
  setWaveformEnabled,
  setVideoEnabled,
  setFourierEnabled,
  setSpectrogramEnabled,
  setLayout,
} from "../store/display-slice";
import DisplayOrderSelect from "./DisplayOrderSelect";
import { selectMedia } from "@/store/playbackSlice";

interface DisplayMenuProps {
  focused?: boolean;
}

const DisplayMenu: React.FC<DisplayMenuProps> = ({ focused = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const media = useSelector(selectMedia);
  const waveformEnabled = useSelector(selectWaveformEnabled);
  const videoEnabled = useSelector(selectVideoEnabled);
  const fourierEnabled = useSelector(selectFourierEnabled);
  const spectrogramEnabled = useSelector(selectSpectrogramEnabled);
  const layout = useSelector(selectLayout);

  const [numberOfDisplayItems, setNumberOfDisplayItems] = useState<number>(2);

  useEffect(() => {
    let displayItems = 0;
    if (waveformEnabled) {
      displayItems++;
    }
    if (videoEnabled) {
      displayItems++;
    }
    if (fourierEnabled) {
      displayItems++;
    }
    if (spectrogramEnabled) {
      displayItems++;
    }
    setNumberOfDisplayItems(displayItems);
  }, [waveformEnabled, videoEnabled, fourierEnabled, spectrogramEnabled]);

  return (
    <div className={`display-menu m-4`}>
      <h2 className=" text-lg">Display Options</h2>
      <div className="flex flex-wrap">
        <div
          className={`tooltip  ${waveformEnabled ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800 rounded"}`}
          title="Waveform"
          onClick={() => dispatch(setWaveformEnabled(!waveformEnabled))}
        >
          <FontAwesomeIcon icon={faWaveSquare} className="h-6 w-6 m-2" />
        </div>
        {media && media.fileType.startsWith("video") && (
          <div
            className={`tooltip  ${videoEnabled ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Video"
            onClick={() => dispatch(setVideoEnabled(!videoEnabled))}
          >
            <FontAwesomeIcon icon={faVideo} className="h-6 w-6 m-2" />
          </div>
        )}
        <div
          className={`tooltip  ${fourierEnabled ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Fourier Transform View"
          onClick={() => dispatch(setFourierEnabled(!fourierEnabled))}
        >
          <FontAwesomeIcon icon={faChartColumn} className="h-6 w-6 m-2" />
        </div>
        <div
          className={`tooltip  ${spectrogramEnabled ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Spectrogram"
          onClick={() => dispatch(setSpectrogramEnabled(!spectrogramEnabled))}
        >
          <FontAwesomeIcon icon={faChartGantt} className="h-6 w-6 m-2" />
        </div>
      </div>
      <h2 className=" text-lg">Render Layout</h2>
      {(numberOfDisplayItems === 0 || numberOfDisplayItems === 1) && (
        <div className="flex flex-wrap">
          <div
            className={`tooltip  ${layout === "single" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Single Layout"
            onClick={() => dispatch(setLayout("single"))}
          >
            <svg
              className="h-10 w-17 m-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 85 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            >
              <rect
                x="2.5"
                y="2.5"
                width="80"
                height="45"
                rx="12.5"
                ry="12.5"
              />
              <text
                x="38.75"
                y="30"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
            </svg>
          </div>
        </div>
      )}
      {numberOfDisplayItems === 2 && (
        <div className="flex flex-wrap">
          <div
            className={`tooltip ${layout === "stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Stacked Layout"
            onClick={() => dispatch(setLayout("stacked"))}
          >
            <svg
              className="h-10 w-17 m-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 85 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            >
              <rect
                x="2.5"
                y="2.5"
                width="80"
                height="45"
                rx="12.5"
                ry="12.5"
              />
              <text
                x="38.75"
                y="18.75"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="38.75"
                y="41.25"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <path d="M2.5 25h80" />
            </svg>
          </div>
          <div
            className={`tooltip  ${layout === "side-by-side" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Side by Side Layout"
            onClick={() => dispatch(setLayout("side-by-side"))}
          >
            <svg
              className="h-10 w-17 m-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 85 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            >
              <rect
                x="2.5"
                y="2.5"
                width="80"
                height="45"
                rx="12.5"
                ry="12.5"
              />
              <text
                x="21.25"
                y="30"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="58.75"
                y="30"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <path d="M42.5 2.5v45" />
            </svg>
          </div>
        </div>
      )}
      {numberOfDisplayItems === 3 && (
        <div className="flex flex-wrap">
          <div
            className={`tooltip  ${layout === "stacked-bottom-side-by-side" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Stacked Bottom Side by Side Layout"
            onClick={() => dispatch(setLayout("stacked-bottom-side-by-side"))}
          >
            <svg
              className="h-10 w-17 m-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 85 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            >
              <rect
                x="2.5"
                y="2.5"
                width="80"
                height="45"
                rx="12.5"
                ry="12.5"
              />
              <text
                x="38.5"
                y="18.75"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="21.25"
                y="41.25"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="58.75"
                y="41.25"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <path d="M42.5 25v22.5" />
              <path d="M2.5 25h80" />
            </svg>
          </div>
          <div
            className={`tooltip  ${layout === "stacked-top-side-by-side" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Stacked Top Side by Side Layout"
            onClick={() => dispatch(setLayout("stacked-top-side-by-side"))}
          >
            <svg
              className="h-10 w-17 m-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 85 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            >
              <rect
                x="2.5"
                y="2.5"
                width="80"
                height="45"
                rx="12.5"
                ry="12.5"
              />
              <text
                x="21.25"
                y="18.75"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="58.75"
                y="18.75"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="38.5"
                y="41.25"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <path d="M42.5 2.5v22.5" />
              <path d="M2.5 25h80" />
            </svg>
          </div>
          <div
            className={`tooltip  ${layout === "side-by-side-right-stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Side by Side Right Stacked Layout"
            onClick={() => dispatch(setLayout("side-by-side-right-stacked"))}
          >
            <svg
              className="h-10 w-17 m-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 85 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            >
              <rect
                x="2.5"
                y="2.5"
                width="80"
                height="45"
                rx="12.5"
                ry="12.5"
              />
              <text
                x="21.25"
                y="30"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="58.75"
                y="18.75"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="58.75"
                y="41.25"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <path d="M42.5 2.5v45" />
              <path d="M42.5 25h40" />
            </svg>
          </div>
          <div
            className={`tooltip  ${layout === "side-by-side-left-stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Side by Side Right Stacked Layout"
            onClick={() => dispatch(setLayout("side-by-side-left-stacked"))}
          >
            <svg
              className="h-10 w-17 m-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 85 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            >
              <rect
                x="2.5"
                y="2.5"
                width="80"
                height="45"
                rx="12.5"
                ry="12.5"
              />
              <text
                x="21.25"
                y="18.75"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="21.25"
                y="41.25"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="58.75"
                y="30"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <path d="M42.5 2.5v45" />
              <path d="M42.5 25h-40" />
            </svg>
          </div>
        </div>
      )}
      {numberOfDisplayItems === 4 && (
        <div className="flex flex-wrap">
          <div
            className={`tooltip  ${layout === "four" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Four Corners Layout"
            onClick={() => dispatch(setLayout("four"))}
          >
            <svg
              className="h-10 w-17 m-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 85 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
            >
              <rect
                x="2.5"
                y="2.5"
                width="80"
                height="45"
                rx="12.5"
                ry="12.5"
              />
              <text
                x="21.25"
                y="18.75"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="58.75"
                y="18.75"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="21.25"
                y="41.25"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <text
                x="58.75"
                y="41.25"
                strokeWidth={2}
                fontSize="16"
                fill="currentColor"
                fontFamily="Consolas"
              >
                4
              </text>
              <path d="M42.5 2.5v45" />
              <path d="M2.5 25h80" />
            </svg>
          </div>
        </div>
      )}
      <h2 className=" text-lg">Display Order</h2>
      <DisplayOrderSelect />
    </div>
  );
};

export default DisplayMenu;
