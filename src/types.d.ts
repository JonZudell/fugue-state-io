declare module 'monaco-editor' {
  export namespace editor {
    export interface IStandaloneCodeEditor {
      setValue(value: string): void;
      getValue(): string;
      // Add other methods and properties as needed
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface IModelContentChangedEvent {
      // Define the properties of the event
    }
  }

  // Add other namespaces, interfaces, and types as needed
}