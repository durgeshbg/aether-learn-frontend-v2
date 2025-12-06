export const Loading = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-muted">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-lg font-semibold text-foreground">Loading</p>
        <p className="text-sm text-muted-foreground">
          Hang tight while we prepare everything for you.
        </p>
      </div>
    </div>
  );
};

export default Loading;
