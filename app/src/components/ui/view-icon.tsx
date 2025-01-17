"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function ViewIcon({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <svg
      className={cn("w-6 h-6", className)}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="13.5"
      viewBox="0 0 24 13.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="2"
        y="1"
        width="20"
        height="11.5"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {value === "single" && (
        <>
          <text
            x="12"
            y="8"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
        </>
      )}
      {value === "stacked" && (
        <>
          <text
            x="12"
            y="5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
          <text
            x="12"
            y="10.5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            2
          </text>
          <line
            x1="2"
            y1="6.75"
            x2="22"
            y2="6.75"
            stroke="currentColor"
            strokeWidth="1"
          />
        </>
      )}
      {value === "side-by-side" && (
        <>
          <text
            x="7"
            y="8"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
          <text
            x="17"
            y="8"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            2
          </text>
          <line
            x1="12"
            y1="1"
            x2="12"
            y2="12.5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </>
      )}
      {value === "side-by-side-3" && (
        <>
          <text
            x={22 / 6 + 1.5}
            y={13.5 / 2 + 0.75}
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
          <text
            x={(22 / 6) * 3 + 1}
            y={13.5 / 2 + 0.75}
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            2
          </text>
          <text
            x={(22 / 6) * 5 + 0.5}
            y={13.5 / 2 + 0.75}
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            3
          </text>
          <line
            x1="15.5"
            y1="1"
            x2="15.5"
            y2="12.5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="8.5"
            y1="1"
            x2="8.5"
            y2="12.5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </>
      )}
      {value === "stacked-3" && (
        <>
          <text
            x={24 / 2}
            y={11.5 / 3}
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
          <text
            x={24 / 2}
            y={(11.5 / 3) * 2}
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            2
          </text>
          <text
            x={24 / 2}
            y={11.625}
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            3
          </text>
          <line
            x1="2"
            y1="4.75"
            x2="22"
            y2="4.75"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="2"
            y1="8.75"
            x2="22"
            y2="8.75"
            stroke="currentColor"
            strokeWidth="1"
          />
        </>
      )}
      {value === "side-by-side-right-stacked" && (
        <>
          <text
            x="7"
            y="7.75"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
          <text
            x="17"
            y="5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            2
          </text>
          <text
            x="17"
            y="10.5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            3
          </text>
          <line
            x1="12"
            y1="1"
            x2="12"
            y2="12.5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="12"
            y1="6.75"
            x2="22"
            y2="6.75"
            stroke="currentColor"
            strokeWidth="1"
          />
        </>
      )}
      {value === "side-by-side-left-stacked" && (
        <>
          <text
            x="7"
            y="5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
          <text
            x="7"
            y="10.5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            2
          </text>
          <text
            x="17"
            y="7.75"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            3
          </text>
          <line
            x1="2"
            y1="6.75"
            x2="12"
            y2="6.75"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="12"
            y1="1"
            x2="12"
            y2="12.5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </>
      )}
      {value === "stacked-bottom-side-by-side" && (
        <>
          <text
            x="12"
            y="5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
          <text
            x="7"
            y="10.5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            2
          </text>
          <text
            x="17"
            y="10.5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            3
          </text>
          <line
            x1="2"
            y1="6.75"
            x2="22"
            y2="6.75"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="12"
            y1="7"
            x2="12"
            y2="12"
            stroke="currentColor"
            strokeWidth="1"
          />
        </>
      )}
      {value === "stacked-top-side-by-side" && (
        <>
          <text
            x="8"
            y="5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            1
          </text>
          <text
            x="16"
            y="5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            2
          </text>
          <text
            x="12"
            y="10.5"
            textAnchor="middle"
            fontSize="3"
            fill="currentColor"
            fontFamily="Consolas"
            strokeWidth={0.5}
          >
            3
          </text>
          <line
            x1="12"
            y1="1"
            x2="12"
            y2="6"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="2"
            y1="6.75"
            x2="22"
            y2="6.75"
            stroke="currentColor"
            strokeWidth="1"
          />
        </>
      )}
    </svg>
  );
}