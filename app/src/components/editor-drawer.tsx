import React, { useEffect, useState } from "react";
import NotationEditor from "@/components/notation-editor";
import { ABCAsset, addAbc, selectProject } from "@/store/project-slice";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/utils/utils";
import { v4 as uuidv4 } from "uuid";
import "@/components/editor-drawer.css";
interface EditorDrawerProps {
  width: number;
  height: number;
}

const EditorDrawer: React.FC<EditorDrawerProps> = ({ width, height }) => {
  const dispatch = useDispatch();
  const [activeAbc, setActiveAbc] = useState<ABCAsset | null>(null);
  const { abcs } = useSelector(selectProject);
  const handleTabChange = (abc: ABCAsset) => {
    setActiveAbc(abc);
  };

  const handleNewFile = (name?: string) => {
    const abc: ABCAsset = {
      name: name || "untitled.abc",
      abc: "",
      id: uuidv4(),
      timingCallback: null,
      characterSelection: null,
    };
    setActiveAbc(abc);
    dispatch(addAbc(abc));
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "n") {
        event.preventDefault();
        handleNewFile();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNewFile]);
  return (
    <div className="editor-drawer">
      {Object.keys(abcs).length === 0 && (
        <div
          className="no-abcs text-white"
          style={{ textAlign: "center", padding: "20px" }}
        >
          Press Command + N to create a new file
        </div>
      )}
      {Object.keys(abcs).length > 0 && (
        <>
          <div
            className="tabs"
            style={{ width: width, height: 45, display: "flex" }}
          >
            {Object.keys(abcs)
              .map((key) => abcs[key])
              .map((abc, index) => (
                <div
                  key={index}
                  className={cn("tab text-white", {
                    active: abc === activeAbc,
                  })}
                  onClick={() => handleTabChange(abc)}
                >
                  <span className="tab-title">{abc.name}</span>
                </div>
              ))}
            <div
              className="tab add-file-button text-white"
              onClick={() => {
                handleNewFile();
              }}
            >
              <span className="tab-title">Add File</span>
            </div>
          </div>
          <div className="tab-content">
            {activeAbc ? (
              <NotationEditor
                width={width}
                height={height - 45}
                abc={activeAbc}
              />
            ) : (
              <div
                className="no-abc-selected text-white"
                style={{ textAlign: "center", padding: "20px" }}
              >
                No ABC Selected
              </div>
            )}
          </div>
        </>
      )}
      ;
    </div>
  );
};

export default EditorDrawer;
