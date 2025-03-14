import { createAsyncThunk, createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { Channels } from "@/lib/dsp";
import { v4 as uuidv4 } from "uuid";
import { setMinimapSource } from "./display-slice";
export interface MediaFile {
  id: string;
  name: string;
  fileType: string;
  url: string;
  audioBuffer: AudioBuffer;
  duration: number;
  offset: number;
  volume: number;
  mode: string;
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
  referenceFile?: string | null;
}

export interface ProjectsStateInterface {
  activeProject: string;
  projects: { [key: string]: Project };
  playback: PlaybackState;
}

interface MediaSource {
  id: string;
}

interface PlaybackState {
  audioContext: AudioContext | null;
  mediaSources: MediaSource[];
  primarySourceId: string | null;
  playing: boolean;
  looping: boolean;
  timeElapsed: number;
  speed: number;
  volume: number;
  loopStart: number;
  loopEnd: number;
  timelineDuration: number;
  gainTrigger: number;
}

const initialId = uuidv4();
const initialPlaybackState: PlaybackState = {
  audioContext: null,
  mediaSources: [],
  primarySourceId: null,
  playing: false,
  looping: false,
  timeElapsed: 0,
  speed: 1,
  volume: 1,
  loopStart: 0,
  loopEnd: 1,
  timelineDuration: 0,
  gainTrigger: 0,
};

const initialState: ProjectsStateInterface = {
  activeProject: initialId,
  projects: {
    [initialId]: { id: initialId, name: "Untitled", mediaFiles: {}, abcs: {} },
  },
  playback: initialPlaybackState,
};

export const uploadFile = createAsyncThunk(
  "playback/uploadFile",
  async ({ file, worker }: { file: File; worker: Worker }, { dispatch }) => {
    return new Promise<MediaFile>(async (_resolve, _reject) => {
      let tempAudioContext = null;
      if (initialPlaybackState.audioContext === null) {
        tempAudioContext = new AudioContext();
        dispatch(setAudioContext(tempAudioContext));
      } else {
        tempAudioContext = initialPlaybackState.audioContext;
      }


      const id = uuidv4();
      if (initialPlaybackState.primarySourceId === null) {
        dispatch(setPrimarySourceId(id));
      }
      const audioBuffer = await tempAudioContext.decodeAudioData(
        await file.arrayBuffer(),
      );
      const isStereo = audioBuffer.numberOfChannels > 1;
      const media: MediaFile = {
        id: id,
        name: file.name,
        stereo: isStereo,
        fileType: file.type,
        offset: 0,
        mode: isStereo ? "L/R" : "L+R",
        volume: 1,
        audioBuffer: audioBuffer,
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
          ? { "L+R": null }
          : { "L": null, "R": null, "L+R": null, "L-R": null },
        processing: true,
        progress: !isStereo
          ? [{ channel: "L+R", progress: 0 }]
          : [
              { channel: "L", progress: 0 },
              { channel: "R", progress: 0 },
              { channel: "L+R", progress: 0 },
              { channel: "L-R", progress: 0 },
            ],
      };
      dispatch(addFile(media));
      dispatch(registerMedia(media));
      dispatch(setMinimapSource(media.id));
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
          channel: "L+R",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: sideChannel.buffer,
          mediaId: id,
          channel: "L-R",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: leftChannel.buffer,
          mediaId: id,
          channel: "L",
        });
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: rightChannel.buffer,
          mediaId: id,
          channel: "R",
        });
      } else {
        worker.postMessage({
          type: "SUMMARIZE",
          arrayBuffer: audioBuffer.getChannelData(0).buffer,
          mediaId: id,
          channel: "L+R",
        });
      }
    });
  },
);

export const selectProject = (state: { project: ProjectsStateInterface }) => {
  return state.project.projects[state.project.activeProject];
};
export const selectPlayback = (state: { project: ProjectsStateInterface }) => {
  return state.project.playback;
}
export const selectMediaGainMap = (state: { map: { [key: string]: number } }) => {
  const mediaFiles = state.project.projects[state.project.activeProject].mediaFiles;
  const result: { [key: string]: number } = {};
  Object.keys(mediaFiles).forEach((key) => {
    console.log("media file", key, mediaFiles[key]);
    result[key] = mediaFiles[key].volume;
  });
  return result
}
export const selectAnyProcessing = (state: {
  project: ProjectsStateInterface;
}) => {
  return Object.values(
    state.project.projects[state.project.activeProject].mediaFiles,
  ).some((file) => file.processing);
};

export const selectProgressState = createSelector(
  (state: { project: ProjectsStateInterface }) => state.project.projects,
  (projects) => {
    return Object.values(projects).flatMap((project) =>
      Object.values(project.mediaFiles).flatMap((file) =>
        file.progress.map((progress) => ({
          projectId: project.id,
          id: file.id,
          name: file.name,
          channel: progress.channel,
          progress: progress.progress,
        })),
      ),
    );
  }
);

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

      const file =
        state.projects[state.activeProject].mediaFiles[action.payload.id];
      console.log("File", file);
      if (!file.progress) {
        console.error("No progress found for file", file);
      } else {
        console.log("File progress", file.progress);
        const progressItem = file.progress.find(
          (p) => p.channel === action.payload.channel,
        );
        console.log("Progress item", progressItem);
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
        if (Object.keys(state.projects[state.activeProject].mediaFiles).length === 1) {
          state.projects[state.activeProject].referenceFile = action.payload.id;
        }
      }
    },
    addAbc: (state, action: PayloadAction<ABCAsset>) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        state.projects[state.activeProject].abcs[action.payload.id] =
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
    setAbc: (state, action: PayloadAction<ABCAsset>) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        state.projects[state.activeProject].abcs[action.payload.id] =
          action.payload;
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
    setReferenceFile: (
      state,
      action: PayloadAction<{ id: string; reference: string | null }>,
    ) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        state.projects[state.activeProject].referenceFile = action.payload.reference;
      }
    },
    setFileChannelProgress: (
      state,
      action: PayloadAction<{ id: string; channel: string; progress: number }>,
    ) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        const file =
          state.projects[state.activeProject].mediaFiles[action.payload.id];
        console.log(file);
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
    setChannelSummary: (
      state,
      action: PayloadAction<{
        summary: Float32Array;
        id: string;
        channel: keyof Channels;
      }>,
    ) => {
      if (state.activeProject === null) {
        console.error("No active project");
      } else {
        const file =
          state.projects[state.activeProject].mediaFiles[action.payload.id];
        file.summary[action.payload.channel] = Array.from(
          action.payload.summary,
        ).map((value) => ({ value }));
      }
    },
    setAudioContext: (
      state,
      action: PayloadAction<AudioContext>,
    ) => {
      state.playback.audioContext = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.playback.volume = Math.min(Math.max(0, action.payload), 1);
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.playback.speed = Math.min(Math.max(0.2, action.payload), 2);
    },
    setTimeElapsed: (state, action: PayloadAction<number>) => {
      state.playback.timeElapsed = action.payload;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.playback.playing = action.payload;
    },
    setLoopStart: (state, action: PayloadAction<number>) => {
      state.playback.loopStart = action.payload;
      if (state.playback.timeElapsed < state.playback.loopStart * state.playback.timelineDuration) {
        state.playback.timeElapsed = state.playback.loopStart * state.playback.timelineDuration;
      }
    },
    setLoopEnd: (state, action: PayloadAction<number>) => {
      state.playback.loopEnd = action.payload;
      if (
        state.playback.looping &&
        state.playback.timeElapsed > state.playback.loopEnd * state.playback.timelineDuration
      ) {
        state.playback.timeElapsed = state.playback.loopEnd * state.playback.timelineDuration;
      }
    },
    setLooping: (state, action: PayloadAction<boolean>) => {
      state.playback.looping = action.payload;
      if (state.playback.looping) {
        state.playback.loopStart = 0;
        state.playback.loopEnd = 1;
      }
    },
    restartPlayback: (state) => {
      state.playback.timeElapsed = state.playback.loopStart * state.playback.timelineDuration;
      state.playback.playing = true;
    },
    registerMedia: (state, action: PayloadAction<MediaFile>) => {
      if (
        !state.playback.mediaSources.find((source) => source.id === action.payload.id)
      ) {
        state.playback.mediaSources.push({
          id: action.payload.id,
        });
      }
      state.playback.timelineDuration = action.payload.duration + action.payload.offset;
    },
    setPrimarySourceId: (state, action: PayloadAction<string>) => {
      state.playback.primarySourceId = action.payload;
    },
    setMediaVolume: (
      state,
      action: PayloadAction<{ id: string; volume: number }>,
    ) => {
      const media = state.projects[state.activeProject].mediaFiles[action.payload.id];
      console.log("Setting media volume", action.payload);
      if (media) {
        console.log("Setting volume", action.payload.volume);
        media.volume = action.payload.volume;
      }
    },
    setMediaMode: (
      state,
      action: PayloadAction<{ id: string; mode: string }>,
    ) => {
      const media = state.projects[state.activeProject].mediaFiles[action.payload.id];
      if (media) {
        media.mode = action.payload.mode;
      }
    },
    setMediaOffset: (
      state,
      action: PayloadAction<{ id: string; offset: number }>,
    ) => {
      const media = state.projects[state.activeProject].mediaFiles[action.payload.id];
      if (media) {
        media.offset = action.payload.offset
      }
      state.playback.timelineDuration = Math.max(
        ...Object.values(state.projects[state.activeProject].mediaFiles).map(
          (media) => media.duration + media.offset,
        ),
      );
    }
  },
});

export const {
  addFile,
  addAbc,
  setAbc,
  removeFile,
  removeAbc,
  setFileProcessing,
  setFileChannelProgress,
  newProject,
  setProgress,
  setChannelSummary,
  setReferenceFile,
  setAudioContext,
  setVolume,
  setSpeed,
  setPlaying,
  setTimeElapsed,
  setLoopStart,
  setLoopEnd,
  setLooping,
  restartPlayback,
  registerMedia,
  setPrimarySourceId,
  setMediaVolume,
  setMediaMode,
  setMediaOffset,
} = projectSlice.actions;
export default projectSlice.reducer;
