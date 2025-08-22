export const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 shadow-2xl">
        {/* Main spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full border-4 border-muted/30 border-t-primary h-16 w-16 shadow-lg" />
          {/* Inner glow effect */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary/50 h-16 w-16 blur-sm" />
        </div>

        {/* Pulsing dots */}
        <div className="flex space-x-2">
          <div
            className="h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>

        {/* Loading text with gradient */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Loading
          </p>
          <p className="text-sm text-muted-foreground/80">
            Please wait while we prepare everything for you
          </p>
        </div>

        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 blur-xl" />
      </div>

      {/* Background overlay with subtle pattern */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-background via-background/95 to-background/90" />
    </div>
  );
};

export default Loading;
