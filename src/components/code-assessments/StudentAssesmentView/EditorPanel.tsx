import { Button } from "@/components/ui/button";
import { Play, Upload } from "lucide-react";
import MonacoEditor from "./MonacoEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONACO_THEMES } from "../constants";
import { useEffect, useState } from "react";
import lastTimeAgo from "@/utils/lastTimeAgo";

interface EditorPanelProps {
  code: string;
  setCode: (value: string) => void;
  language?: { value: number; label: string };
  isRunning: boolean;
  runCode: () => void;
  submitCode: () => void;
  assesmentId: string;
}

const EditorPanel = ({
  code,
  setCode,
  language,
  isRunning,
  runCode,
  submitCode,
  assesmentId,
}: EditorPanelProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("vs-dark");
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      localStorage.setItem(`code_${assesmentId}`, code);
      setLastSaved(new Date());
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [code, assesmentId]);

  // Load saved code on mount
  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${assesmentId}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [assesmentId, setCode]);

  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                Running
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run
              </>
            )}
          </Button>
          <Button
            onClick={submitCode}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg transition-all duration-300"
          >
            <Upload className="h-4 w-4 mr-1" />
            Submit
          </Button>
        </div>

        <div className="text-sm text-white/60 hidden md:block">
          Last saved: {lastTimeAgo(lastSaved.toISOString())}
        </div>

        <Select value={selectedTheme} onValueChange={setSelectedTheme}>
          <SelectTrigger className="w-[180px]" id="theme-select">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            {MONACO_THEMES.map((theme) => (
              <SelectItem key={theme.value} value={theme.value}>
                {theme.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <MonacoEditor
          value={code}
          selectedTheme={selectedTheme}
          languageId={language?.value}
          onChange={(value) => setCode(value || "")}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
