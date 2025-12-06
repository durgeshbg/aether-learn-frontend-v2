import { AlertTriangle } from "lucide-react";
import { Button } from "../../ui/button";
import useFullscreen from "@/hooks/useFullScreen";
import { MAX_WARNING_COUNT } from "../constants";

interface IWarningScreen {
  warningCount: number;
  setShowWarning: (show: boolean) => void;
}

const WarningScreen = ({ warningCount, setShowWarning }: IWarningScreen) => {
  const { enterFullscreen } = useFullscreen();
  const handleContinue = () => {
    setShowWarning(false);
    enterFullscreen();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur">
      <div className="w-full max-w-md rounded-xl border border-border/70 bg-card p-6 text-center shadow-lg">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Security warning
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          You switched away from the quiz. Warning {warningCount}/{MAX_WARNING_COUNT}.
          {warningCount >= MAX_WARNING_COUNT &&
            " Next violation will auto-submit your quiz."}
        </p>
        <Button onClick={handleContinue} className="w-full">
          Continue quiz
        </Button>
      </div>
    </div>
  );
};

export default WarningScreen;
