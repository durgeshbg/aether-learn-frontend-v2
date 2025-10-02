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
