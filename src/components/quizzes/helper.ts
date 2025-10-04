export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  let i = shuffled.length;
  while (i) {
    const j = Math.floor(Math.random() * i--);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const getPallete = (readOnly?: boolean, isCorrect?: boolean) => {
  const palleteColors = {
    correct: [
      "bg-green-500/20 border-green-400 text-green-300",
      "bg-green-500 text-white",
      "h-5 w-5 text-green-400 ml-auto",
    ],
    incorrect: [
      "bg-red-500/20 border-red-400 text-red-300",
      "bg-red-500 text-white",
      "h-5 w-5 text-red-400 ml-auto",
    ],
    default: [
      "bg-blue-500/20 border-blue-400 text-blue-300",
      "bg-blue-500 text-white",
      "h-5 w-5 text-blue-400 ml-auto",
    ],
  };
  if (readOnly) {
    return isCorrect ? palleteColors.correct : palleteColors.incorrect;
  }
  return palleteColors.default;
};
