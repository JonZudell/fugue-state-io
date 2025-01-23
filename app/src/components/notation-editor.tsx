"use client";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { setNotationList } from "@/store/playback-slice";
import { Editor } from "@monaco-editor/react";
interface NotationEditorProps {
  className?: string;
  width: number;
  height: number;
}

const NotationEditor: React.FC<NotationEditorProps> = ({
  width,
  height,
}) => {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  function handleEditorChange(value: any, event: any) {
    console.log("here is the current model value:", value);
    dispatch(setNotationList([value]));
  }
  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.languages.register({ id: "abc" });
    monaco.languages.setMonarchTokensProvider("abc", {
      tokenizer: {
        root: [[/^.*$/, "string"]],
      },
    });
    monaco.editor.defineTheme("abcTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [{ token: "string", foreground: "ffffff" }],
      colors: {},
    });
    monaco.editor.setTheme("abcTheme");
  }
  return (
    <Editor
      width={width}
      height={height}
      defaultLanguage="abc"
      defaultValue=""
      theme="abcTheme"
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
    />
  );
};
export default NotationEditor;
