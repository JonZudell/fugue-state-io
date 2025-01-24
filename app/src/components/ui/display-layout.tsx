"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLayout, selectLayout, selectOrder } from "@/store/display-slice";
import { ViewIcon } from "@/components/ui/view-icon";

export function DisplayLayout() {
  const dispatch = useDispatch();
  const layout = useSelector(selectLayout);
  const order = useSelector(selectOrder);
  const [count, setCount] = useState(order.length);
  useEffect(() => {
    setCount(order.length);
  }, [order]);

  useEffect(() => {
    if (count === 0) {
      dispatch(setLayout("none"));
    } else if (count === 1) {
      dispatch(setLayout("single"));
    } else if (count === 2) {
      dispatch(setLayout("stacked"));
    } else if (count === 3) {
      dispatch(setLayout("stacked-3"));
    }
  }, [count, dispatch]);

  return (
    <div className="flex flex-col flex-1 m-2">
      Select View
      {count === 0 && <div>No Displays Selected</div>}
      {count === 1 && (
        <div className="flex flex-wrap">
          <div
            className={`tooltip h-[135px] w-[235px]  ${layout === "single" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Single Layout"
            onClick={() => dispatch(setLayout("single"))}
          >
            <ViewIcon value="single" className={"w-full h-full"} />
          </div>
        </div>
      )}
      {count === 2 && (
        <div className="flex flex-wrap">
          <div
            className={`tooltip h-[135px] w-[235px] ${layout === "stacked" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Stacked Layout"
            onClick={() => dispatch(setLayout("stacked"))}
          >
            <ViewIcon value="stacked" className={"w-full h-full"} />
          </div>
          <div
            className={`tooltip h-[135px] w-[235px] ${layout === "side-by-side" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Side by Side Layout"
            onClick={() => dispatch(setLayout("side-by-side"))}
          >
            <ViewIcon value="side-by-side" className={"w-full h-full"} />
          </div>
        </div>
      )}
      {count === 3 && (
        <div className="flex flex-wrap">
          <div
            className={`tooltip h-[135px] w-[235px] ${layout === "stacked-3" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Stacked Layout"
            onClick={() => dispatch(setLayout("stacked-3"))}
          >
            <ViewIcon value="stacked-3" className={"w-full h-full"} />
          </div>
          <div
            className={`tooltip h-[135px] w-[235px] ${layout === "side-by-side-3" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Side by Side Layout"
            onClick={() => dispatch(setLayout("side-by-side-3"))}
          >
            <ViewIcon value="side-by-side-3" className={"w-full h-full"} />
          </div>
          <div
            className={`tooltip h-[135px] w-[235px] ${layout === "side-by-side-right-stacked" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Stacked Layout"
            onClick={() => dispatch(setLayout("side-by-side-right-stacked"))}
          >
            <ViewIcon
              value="side-by-side-right-stacked"
              className={"w-full h-full"}
            />
          </div>
          <div
            className={`tooltip h-[135px] w-[235px] ${layout === "side-by-side-left-stacked" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Side by Side Layout"
            onClick={() => dispatch(setLayout("side-by-side-left-stacked"))}
          >
            <ViewIcon
              value="side-by-side-left-stacked"
              className={"w-full h-full"}
            />
          </div>
          <div
            className={`tooltip h-[135px] w-[235px] ${layout === "stacked-bottom-side-by-side" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Stacked Layout"
            onClick={() => dispatch(setLayout("stacked-bottom-side-by-side"))}
          >
            <ViewIcon
              value="stacked-bottom-side-by-side"
              className={"w-full h-full"}
            />
          </div>
          <div
            className={`tooltip h-[135px] w-[235px] ${layout === "stacked-top-side-by-side" ? "border border-gray-900 bg-gray-400 rounded" : "border border-gray-800"}`}
            title="Side by Side Layout"
            onClick={() => dispatch(setLayout("stacked-top-side-by-side"))}
          >
            <ViewIcon
              value="stacked-top-side-by-side"
              className={"w-full h-full"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
