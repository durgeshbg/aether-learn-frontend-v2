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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-red-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Security Warning
          </h3>
          <p className="text-white/80 mb-4">
            You switched away from the quiz. Warning {warningCount}/3.
            {warningCount >= MAX_WARNING_COUNT &&
              " Next violation will auto-submit your quiz."}
          </p>
          <Button
            onClick={handleContinue}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl"
          >
            Continue Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarningScreen;
