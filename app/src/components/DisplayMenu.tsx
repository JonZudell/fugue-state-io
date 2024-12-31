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

interface DisplayMenuProps {
  focused?: boolean;
}

const DisplayMenu: React.FC<DisplayMenuProps> = ({ focused = false }) => {
  const dispatch = useDispatch<AppDispatch>();

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
      <h2 className="mx-1 text-lg">Display Options</h2>
      <div className="flex flex-wrap">
        <div
          className={`tooltip mx-1 ${waveformEnabled ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800 rounded"}`}
          title="Waveform"
          onClick={() => dispatch(setWaveformEnabled(!waveformEnabled))}
        >
          <FontAwesomeIcon icon={faVideo} className="h-6 w-6 m-2" />
        </div>
        <div
          className={`tooltip mx-1 ${videoEnabled ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Video"
          onClick={() => dispatch(setVideoEnabled(!videoEnabled))}
        >
          <FontAwesomeIcon icon={faWaveSquare} className="h-6 w-6 m-2" />
        </div>
        <div
          className={`tooltip mx-1 ${fourierEnabled ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Fourier Transform View"
          onClick={() => dispatch(setFourierEnabled(!fourierEnabled))}
        >
          <FontAwesomeIcon icon={faChartSimple} className="h-6 w-6 m-2" />
        </div>
        <div
          className={`tooltip mx-1 ${spectrogramEnabled ? "border border-gray-900 bg-gray-700rounded" : "border border-gray-800"}`}
          title="Spectrogram"
          onClick={() => dispatch(setSpectrogramEnabled(!spectrogramEnabled))}
        >
          <FontAwesomeIcon icon={faBarsStaggered} className="h-6 w-6 m-2" />
        </div>
      </div>
      <h2 className="mx-1 text-lg">Render Layout</h2>
      {numberOfDisplayItems === 1 && (
        <div className="flex flex-wrap">
          <div
            className={`tooltip mx-1 ${layout === "single" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
            title="Single Layout"
            onClick={() => dispatch(setLayout("single"))}
          >
            <svg
              className="h-24 w-34 m-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 13"
              fill="none"
              stroke="currentColor"
            >
              <rect x="2" y="2" width="16" height="9" rx="2" ry="2" />
            </svg>
          </div>
        </div>
      )}
      { numberOfDisplayItems === 2 && (<div className="flex flex-wrap">
        <div
          className={`tooltip mx-1 ${layout === "stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Stacked Layout"
          onClick={() => dispatch(setLayout("stacked"))}
        >
          <svg
            className="h-24 w-34 m-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 13"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="2" width="16" height="9" rx="2" ry="2" />
            <path d="M2 6.5h16" />
          </svg>
        </div>
        <div
          className={`tooltip mx-1 ${layout === "side-by-side" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Side by Side Layout"
          onClick={() => dispatch(setLayout("side-by-side"))}
        >
          <svg
            className="h-24 w-34 m-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 13"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="2" width="16" height="9" rx="2" ry="2" />

            <path d="M10 2v9" />
          </svg>
        </div>
      </div>)}
      { numberOfDisplayItems === 3 && (<div className="flex flex-wrap">
        <div
          className={`tooltip mx-1 ${layout === "stacked-top-side-by-side" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Stacked Layout Top Side by Side"
          onClick={() => dispatch(setLayout("stacked-top-side-by-side"))}
        >
          <svg
            className="h-24 w-34 m-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 13"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="2" width="16" height="9" rx="2" ry="2" />
            <path d="M2 6.5h16" />
            <path d="M10 2v4.5" />
          </svg>
        </div>
        <div
          className={`tooltip mx-1 ${layout === "stacked-bottom-side-by-side" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Stacked Layout Bottom Side by Side"
          onClick={() => dispatch(setLayout("stacked-bottom-side-by-side"))}
        >
          <svg
            className="h-24 w-34 m-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 13"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="2" width="16" height="9" rx="2" ry="2" />
            <path d="M2 6.5h16" />
            <path d="M10 6.5v4.5" />
          </svg>
        </div>
        <div
          className={`tooltip mx-1 ${layout === "side-by-side-left-stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Side by Side Layout Left Stacked"
          onClick={() => dispatch(setLayout("side-by-side-left-stacked"))}
        >
          <svg
            className="h-24 w-34 m-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 13"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="2" width="16" height="9" rx="2" ry="2" />
            <path d="M10 2v9" />
            <path d="M2 6.5h8" />
          </svg>
        </div>
        <div
          className={`tooltip mx-1 ${layout === "side-by-side-right-stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Side by Side Layout Right Stacked"
          onClick={() => dispatch(setLayout("side-by-side-right-stacked"))}
        >
            <svg
            className="h-24 w-34 m-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 13"
            fill="none"
            stroke="currentColor"
            >
            <rect x="2" y="2" width="16" height="9" rx="2" ry="2" />
            <path d="M10 2v9" />
            <path d="M10 6.5h8" />
            </svg>
        </div>
      </div>)}
      { numberOfDisplayItems === 4 && (<div className="flex flex-wrap">
        <div
          className={`tooltip mx-1 ${layout === "side-by-side-left-stacked" ? "border border-gray-900 bg-gray-700 rounded" : "border border-gray-800"}`}
          title="Side by Side Layout Left Stacked"
          onClick={() => dispatch(setLayout("side-by-side-left-stacked"))}
        >
          <svg
            className="h-24 w-34 m-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 13"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="2" width="16" height="9" rx="2" ry="2" />
            <path d="M10 2v9" />
            <path d="M2 6.5h16" />
          </svg>
        </div>
        </div>)}
    </div>
  );
};

export default DisplayMenu;
