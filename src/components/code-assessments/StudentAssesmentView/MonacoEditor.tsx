import { JUDGE0_TO_MONACO_MAPPING, LANG_KEYS } from "@/static-data/languages";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

interface MonacoEditorProps {
  value?: string;
  languageId?: number;
  selectedTheme?: string;
  onChange: (value: string | undefined) => void;
}

function MonacoEditor({
  value,
  languageId,
  selectedTheme,
  onChange,
}: MonacoEditorProps) {
  const defaultLanguage = JUDGE0_TO_MONACO_MAPPING.get(LANG_KEYS.PLAIN_TEXT);
  const language = languageId
    ? JUDGE0_TO_MONACO_MAPPING.get(languageId)
    : defaultLanguage;

  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "Sans Serif, Fira Code, monospace",
  };

  return (
    <Editor
      value={value}
      onChange={onChange}
      height="56.6vh"
      language={language}
      theme={selectedTheme}
      options={options}
    />
  );
}

export default MonacoEditor;
