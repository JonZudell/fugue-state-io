import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Channels } from "@/lib/dsp";
import { v4 as uuidv4 } from "uuid";
import { setMedia } from "./playback-slice";
export interface MediaFile {
  id: string;
  name: string;
  fileType: string;
  url: string;
  duration: number;
  summary: Channels;
  sampleRate: number;
  stereo: boolean;
  processing: boolean;
  progress: { channel: string; progress: number }[];
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
  mediaFiles: { [key: string]: MediaFile };
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
    [initialId]: { id: initialId, name: "Untitled", mediaFiles: {}, abcs: {} },
  },
};

export const uploadFile = createAsyncThunk(
  "playback/uploadFile",
  async ({ file, worker }: { file: File, worker: Worker }, { dispatch }) => {
    return new Promise<MediaFile>(async (_resolve, _reject) => {
      const id = uuidv4();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(
        await file.arrayBuffer(),
      );
      const isStereo = audioBuffer.numberOfChannels > 1;
      const media: MediaFile = {
        id: id,
        name: file.name,
        stereo: isStereo,
        fileType: file.type,
        url: (() => {
          try {
            return URL.createObjectURL(new Blob([file], { type: file.type }));
          } catch (error) {
            console.error("Failed to create object URL", error);
            return "";
          }
        })(),
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        summary: isStereo
          ? { mono: null }
          : { left: null, right: null, mono: null, side: null },
        processing: true,
        progress: !isStereo
          ? [{ channel: "mono", progress: 0 }]
          : [
              { channel: "left", progress: 0 },
              { channel: "right", progress: 0 },
              { channel: "mono", progress: 0 },
              { channel: "side", progress: 0 },
            ],
      };
      dispatch(addFile(media));
      dispatch(setMedia(media));
      if (isStereo) {
        const leftChannel = audioBuffer.getChannelData(0);
        const rightChannel = audioBuffer.getChannelData(1);
        const monoChannel = new Float32Array(leftChannel.length);
        const sideChannel = new Float32Array(leftChannel.length);
        for (let i = 0; i < leftChannel.length; i++) {
          monoChannel[i] = (leftChannel[i] + rightChannel[i]) / 2;
        }
        for (let i = 0; i < leftChannel.length; i++) {
          sideChannel[i] = leftChannel[i] - rightChannel[i] / 2;
        }
        const framesNeeded = (leftChannel.length / 2048 - 1) * 8 * 4;
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: monoChannel.buffer,
          mediaId: id,
          channel: "mono",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: sideChannel.buffer,
          mediaId: id,
          channel: "side",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: leftChannel.buffer,
          mediaId: id,
          channel: "left",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: rightChannel.buffer,
          mediaId: id,
          channel: "right",
        });
      } else {
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: audioBuffer.getChannelData(0).buffer,
          mediaId: id,
          channel: "mono",
        });
      }
    });
  },
);

export const selectProject = (state: { project: ProjectsStateInterface }) => {
  return state.project.projects[state.project.activeProject];
};

export const selectAnyProcessing = (state: {
  project: ProjectsStateInterface;
}) => {
  return Object.values(
    state.project.projects[state.project.activeProject].mediaFiles,
  ).some((file) => file.processing);
};

export const selectProgress = (state: { project: ProjectsStateInterface }) => {
  return state.project.projects[state.project.activeProject];
}
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
        mediaFiles: {},
        abcs: {},
      };
    },
    setProgress: (
      state,
      action: PayloadAction<{ id: string; channel: string; progress: number }>,
    ) => {
      console.log("Setting progress", action.payload);
      const file = state.projects[state.activeProject].mediaFiles[action.payload.id];
      if (!file.progress) {
        console.error("No progress found for file", file);
      } else {
        const progressItem = file.progress.find(
          (p) => p.channel === action.payload.channel,
        );
        if (progressItem) {
          progressItem.progress = action.payload.progress;
        } else {
          console.error(
            "No progress item found for channel",
            action.payload.channel,
          );
        }
      }
      if (file.progress.every((p) => p.progress === 1)) {
        file.processing = false;
      }
    },
    addFile: (state, action: PayloadAction<MediaFile>) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        console.log("Adding file", action.payload);
        state.projects[state.activeProject].mediaFiles[action.payload.id] =
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
        delete state.projects[state.activeProject].mediaFiles[action.payload];
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
        state.projects[state.activeProject].mediaFiles[
          action.payload.id
        ].processing = action.payload.processing;
      }
    },
    setFileChannelProgress: (
      state,
      action: PayloadAction<{ id: string; channel: string; progress: number }>,
    ) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        const file = state.projects[state.activeProject].mediaFiles[action.payload.id];
        console.log(file)
        if (!file.progress) {
          console.error("No progress found for file", file);
        } else {
          const progressItem = file.progress.find(
            (p) => p.channel === action.payload.channel,
          );
          if (progressItem) {
            progressItem.progress = action.payload.progress;
          } else {
            console.error(
              "No progress item found for channel",
              action.payload.channel,
            );
          }
        }
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
  setFileChannelProgress,
  newProject,
  setProgress,
} = projectSlice.actions;
export default projectSlice.reducer;
