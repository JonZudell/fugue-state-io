"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
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
} from "../store/displaySlice";
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
          <FontAwesomeIcon icon={faChartSimple} className="h-6 w-6 m-2" />
        </div>
        <div
          className={`tooltip  ${spectrogramEnabled ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Spectrogram"
          onClick={() => dispatch(setSpectrogramEnabled(!spectrogramEnabled))}
        >
          <FontAwesomeIcon icon={faBarsStaggered} className="h-6 w-6 m-2" />
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
              className="h-20 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
            >
              <rect x="5" y="5" width="160" height="90" rx="25" ry="25" />
              <text
                x="77.5"
                y="60"
                strokeWidth={4}
                fontSize="32"
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
              className="h-20 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
            >
              <rect x="5" y="5" width="160" height="90" rx="25" ry="25" />
              <text
                x="77.5"
                y="37.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="77.5"
                y="82.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <path d="M5 50h160" />
            </svg>
          </div>
          <div
            className={`tooltip  ${layout === "side-by-side" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Side by Side Layout"
            onClick={() => dispatch(setLayout("side-by-side"))}
          >
            <svg
              className="h-20 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
            >
              <rect x="5" y="5" width="160" height="90" rx="25" ry="25" />
              <text
                x="42.5"
                y="60"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="117.5"
                y="60"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <path d="M85 5v90" />
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
              className="h-20 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
            >
              <rect x="5" y="5" width="160" height="90" rx="25" ry="25" />
              <text
                x="77"
                y="37.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="42.5"
                y="82.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="117.5"
                y="82.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <path d="M85 50v45" />
              <path d="M5 50h160" />
            </svg>
          </div>
          <div
            className={`tooltip  ${layout === "stacked-top-side-by-side" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Stacked Top Side by Side Layout"
            onClick={() => dispatch(setLayout("stacked-top-side-by-side"))}
          >
            <svg
              className="h-20 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
            >
              <rect x="5" y="5" width="160" height="90" rx="25" ry="25" />
              <text
                x="42.5"
                y="37.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="117.5"
                y="37.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="77"
                y="82.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <path d="M85 5v45" />
              <path d="M5 50h160" />
            </svg>
          </div>
          <div
            className={`tooltip  ${layout === "side-by-side-right-stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Side by Side Right Stacked Layout"
            onClick={() => dispatch(setLayout("side-by-side-right-stacked"))}
          >
            <svg
              className="h-20 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
            >
              <rect x="5" y="5" width="160" height="90" rx="25" ry="25" />
              <text
                x="42.5"
                y="60"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="117.5"
                y="37.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="117.5"
                y="82.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <path d="M85 5v90" />
              <path d="M85 50h80" />
            </svg>
          </div>
          <div
            className={`tooltip  ${layout === "side-by-side-left-stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Side by Side Right Stacked Layout"
            onClick={() => dispatch(setLayout("side-by-side-left-stacked"))}
          >
            <svg
              className="h-20 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
            >
              <rect x="5" y="5" width="160" height="90" rx="25" ry="25" />
              <text
                x="42.5"
                y="37.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="42.5"
                y="82.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="117.5"
                y="60"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <path d="M85 5v90" />
              <path d="M85 50h-80" />
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
              className="h-20 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
            >
              <rect x="5" y="5" width="160" height="90" rx="25" ry="25" />
              <text
                x="42.5"
                y="37.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                1
              </text>
              <text
                x="117.5"
                y="37.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                2
              </text>
              <text
                x="42.5"
                y="82.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                3
              </text>
              <text
                x="117.5"
                y="82.5"
                strokeWidth={4}
                fontSize="32"
                fill="currentColor"
                fontFamily="Consolas"
              >
                4
              </text>
              <path d="M85 5v90" />
              <path d="M5 50h160" />
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
