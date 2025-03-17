"use client";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { ABCAsset, setAbc } from "@/store/project-slice";
import { Editor } from "@monaco-editor/react";
interface NotationEditorProps {
  className?: string;
  width: number;
  height: number;
  abc: ABCAsset;
}

const NotationEditor: React.FC<NotationEditorProps> = ({
  width,
  height,
  abc,
}) => {
  const monacoRef = useRef<any | null>(null);
  const editorRef = useRef<any | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(abc.abc);
    }
  }, [abc]);

  function handleEditorChange(value: any, event: any) {
    console.log("here is the current model value:", value);
    dispatch(setAbc({ ...abc, abc: value }));
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
