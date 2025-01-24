import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Channels } from "@/lib/dsp";
import { v4 as uuidv4 } from "uuid";
export interface Progress {
  channel: string;
  progress: number;
}

export interface MediaFile {
  id: string;
  name: string;
  fileType: string;
  url: string;
  duration: number;
  summary?: Channels;
  sampleRate: number;
  processing: boolean;
  progress: Progress[];
}

export interface ABCAsset {
  id: string;
  name: string;
  abc: string;
  timingCallback: any;
  characterSelection: any;
}

export interface Project {
  id: string;
  name: string;
  files: { [key: string]: MediaFile };
  abcs: { [key: string]: ABCAsset };
}

export interface ProjectsStateInterface {
  activeProject: string;
  projects: { [key: string]: Project };
}

const initialId = uuidv4();

const initialState: ProjectsStateInterface = {
  activeProject: initialId,
  projects: {
    [initialId]: { id: initialId, name: "Untitled", files: {}, abcs: {} },
  },
};

export const selectProject = (state: { project: ProjectsStateInterface }) => {
  return state.project.projects[state.project.activeProject];
};

export const selectAnyProcessing = (state: {
  project: ProjectsStateInterface;
}) => {
  return Object.values(
    state.project.projects[state.project.activeProject].files,
  ).some((file) => file.processing);
};
export const selectProgresses = (state: {
  project: ProjectsStateInterface;
}) => {
  const accumulatedProgresses = [];
  for (const file of Object.values(
    state.project.projects[state.project.activeProject].files,
  )) {
    const progresses = file.progress.map((progress) => ({
      progress: progress.progress,
      channel: progress.channel,
      id: file.id,
      name: file.name,
    }));
    accumulatedProgresses.push(...progresses);
  }
  return accumulatedProgresses;
};
const projectSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    newProject: (state, action: PayloadAction<string>) => {
      const id = uuidv4();
      state.activeProject = action.payload;
      state.projects[action.payload] = {
        id: id,
        name: action.payload,
        files: {},
        abcs: {},
      };
    },
    setProgress: (
      state,
      action: PayloadAction<{ id: string; channel: string; progress: number }>,
    ) => {
      const file = state.projects[state.activeProject].files[action.payload.id];
      if (file && file.progress) {
        const progressItem = file.progress.find((p) => p.channel === action.payload.channel);
        if (progressItem) {
          progressItem.progress = action.payload.progress;
        } else {
          console.error("No progress item found for channel", action.payload.channel);
        }
      } else {
        console.error("No file or progress found for id", action.payload.id);
      }
    },
    addFile: (state, action: PayloadAction<MediaFile>) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        state.projects[state.activeProject].files[action.payload.id] =
          action.payload;
      }
    },
    addAbc: (state, action: PayloadAction<ABCAsset>) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        state.projects[state.activeProject].abcs[action.payload.name] =
          action.payload;
      }
    },
    removeFile: (state, action: PayloadAction<string>) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        delete state.projects[state.activeProject].files[action.payload];
      }
    },
    removeAbc: (state, action: PayloadAction<string>) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        delete state.projects[state.activeProject].abcs[action.payload];
      }
    },
    setFileProcessing: (
      state,
      action: PayloadAction<{ id: string; processing: boolean }>,
    ) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        state.projects[state.activeProject].files[
          action.payload.id
        ].processing = action.payload.processing;
      }
    },
    setFileProgress: (
      state,
      action: PayloadAction<{ id: string; progress: Progress[] }>,
    ) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        state.projects[state.activeProject].files[action.payload.id].progress =
          action.payload.progress;
      }
    },
  },
});

export const {
  addFile,
  addAbc,
  removeFile,
  removeAbc,
  setFileProcessing,
  setFileProgress,
  newProject,
  setProgress,
} = projectSlice.actions;
export default projectSlice.reducer;
