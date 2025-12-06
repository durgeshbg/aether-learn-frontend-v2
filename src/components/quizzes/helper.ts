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
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const getPallete = (readOnly?: boolean, isCorrect?: boolean) => {
  const palleteColors = {
    correct: [
      "border border-emerald-300 bg-emerald-500/10 text-emerald-500",
      "bg-emerald-500 text-white ",
      "h-5 w-5 text-emerald-500 ml-auto",
    ],
    incorrect: [
      "border border-destructive/40 bg-destructive/10 text-destructive",
      "bg-destructive text-destructive-foreground",
      "h-5 w-5 text-destructive ml-auto",
    ],
    default: [
      "border border-primary/40 bg-primary/5 text-primary",
      "bg-primary text-primary-foreground",
      "h-5 w-5 text-primary ml-auto",
    ],
  };
  if (readOnly) {
    return isCorrect ? palleteColors.correct : palleteColors.incorrect;
  }
  return palleteColors.default;
};
