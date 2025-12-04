import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBookmarkedModules } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { getModuleLink } from "@/utils/getModuleLink";

function BookMarkedModules() {
  const { data: bookmarks } = useQuery({
    queryKey: userKeys.bookmarkedModules(),
    queryFn: async () => {
      return getBookmarkedModules(axiosInstance);
    },
    select: (data) => data.bookmarks,
  });
  const navigate = useNavigate();

  const bookmarkedModuleURLs = bookmarks?.map((b) => ({
    title: b.module.title,
    lessonTitle: b.module.lesson.title,
    url: getModuleLink(b.module),
  }));

  const handleModuleClick = (url: string) => {
    navigate(url);
  };

  if (!bookmarkedModuleURLs?.length) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bookmark className="size-5" />
            </div>
            <CardTitle className="text-xl font-semibold">
              No bookmarked modules yet
            </CardTitle>
            <CardDescription>
              Save modules while browsing courses to get back to them quickly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Quick access
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Bookmarked modules
            </h1>
            <p className="text-muted-foreground">
              Revisit saved lessons without searching through every course.
            </p>
          </div>
          <span className="text-sm text-muted-foreground">
            {bookmarkedModuleURLs.length} saved
          </span>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bookmarkedModuleURLs.map((module) => (
          <button
            key={module.url}
            type="button"
            onClick={() => handleModuleClick(module.url)}
            className="text-left cursor-pointer"
          >
            <Card className="h-full rounded-xl border border-border/60 transition-colors hover:border-primary/40">
              <CardHeader className="gap-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5 font-medium">
                    Lesson
                  </span>
                  <span className="truncate">{module.lessonTitle}</span>
                </div>
                <CardTitle className="line-clamp-2 text-base font-semibold">
                  {module.title}
                </CardTitle>
                <CardDescription>
                  Tap to resume where you left off.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="font-medium text-primary">Open module</span>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BookMarkedModules;
