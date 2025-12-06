import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <Card className="border border-border/70 gap-0">
      <CardHeader className="gap-4 border-b !pb-0">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Running
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={submitCode}
              disabled={isRunning}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Submit
            </Button>
          </div>
          <div className="text-xs text-muted-foreground hidden md:block">
            Last saved {lastTimeAgo(lastSaved.toISOString())}
          </div>
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Editor theme" />
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
      </CardHeader>
      <CardContent className="p-0">
        <MonacoEditor
          value={code}
          selectedTheme={selectedTheme}
          languageId={language?.value}
          onChange={(value) => setCode(value || "")}
        />
      </CardContent>
    </Card>
  );
};

export default EditorPanel;
