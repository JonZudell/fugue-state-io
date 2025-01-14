"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Fragment } from "react";
import { ComponentTree } from "@/store/displaySlice";

interface Display {
  components: (React.ReactNode | ComponentTree)[];
  direction: "horizontal" | "vertical";
}

const Display: React.FC<Display> = ({ direction, components }) => {
  return (
    <ResizablePanelGroup direction={direction} >
      <ResizablePanel>
        {components.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            No Displays Set
          </div>
        ) : (
          <ResizablePanelGroup
            direction={direction}
            className="h-full w-full"
          >
            {components.map((component, index) => (
              <Fragment key={index}>
                {index !== 0 && <ResizableHandle withHandle={true} />}
                <ResizablePanel>{component}</ResizablePanel>
              </Fragment>
            ))}
          </ResizablePanelGroup>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Display;
