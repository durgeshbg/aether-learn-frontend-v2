import { FileText, Upload } from "lucide-react";
import DescriptionTab from "./DescriptionTab";
import type { ActiveTab } from "./types";
import type { Dispatch, SetStateAction } from "react";
import type { CodeAssesment } from "@/types/CodeAssesment";
import type { TestCase } from "@/types/TestCase";
import type { Language } from "@/static-data/languages";

interface ProblemPanelProps {
  activeTab: ActiveTab;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
  codeAssessment: CodeAssesment;
  testCases?: TestCase[];
  langauge?: Language;
}

const ProblemPanel = ({
  activeTab,
  setActiveTab,
  codeAssessment,
  testCases,
  langauge,
}: ProblemPanelProps) => {
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl h-screen overflow-y-scroll">
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "description"
              ? "text-white bg-white/10 border-b-2 border-emerald-400"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Description
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "submissions"
              ? "text-white bg-white/10 border-b-2 border-emerald-400"
              : "text-white/70 hover:text-white hover:bg-white/5"
          }`}
        >
          <Upload className="h-4 w-4 inline mr-2" />
          Submissions
        </button>
      </div>

      <div className="p-4 h-fit">
        {activeTab === "description" ? (
          <DescriptionTab
            codeAssessment={codeAssessment}
            testCases={testCases}
            language={langauge}
          />
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Your Submissions
            </h3>
            <div className="text-center py-8">
              {/* TODO: List past submissions when backend is ready */}
              <Upload className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">No submissions yet</p>
              <p className="text-white/40 text-sm">
                Submit your solution to see results here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPanel;
