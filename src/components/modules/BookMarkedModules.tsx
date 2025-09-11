import { getBookmarkedModules } from "@/services/user";
import { routes } from "@/static-data/routes";
import { userKeys } from "@/tanstack/keys/userKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

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
    url: routes.MODULE_DETAILS(
      b.module.lesson.course.id,
      b.module.lesson.id,
      b.module.id,
    ),
  }));

  const handleModuleClick = (url: string) => {
    navigate(url);
  };

  if (!bookmarkedModuleURLs?.length) {
    return (
      <div className="min-h-screen w-full p-4 sm:p-8 bg-gradient-to-br from-background to-muted/30 backdrop-blur-xl border border-border/20">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-card/40 border border-border/30 rounded-2xl p-8 shadow-2xl shadow-foreground/10">
            <p className="text-muted-foreground text-center text-lg">
              No bookmarked modules found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 sm:p-8 bg-gradient-to-br from-background to-muted/30 backdrop-blur-xl border border-border/20">
      {/* Main container with glassmorphic background */}
      <div className="max-w-7xl mx-auto">
        {/* Optional header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bookmarked Modules
          </h1>
          <p className="text-muted-foreground">Your saved learning modules</p>
        </div>

        {/* Grid container for modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {bookmarkedModuleURLs.map((module, index) => (
            <div
              key={index}
              onClick={() => handleModuleClick(module.url)}
              className="group relative cursor-pointer transition-all duration-300 ease-out transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Glassmorphic card */}
              <div className="backdrop-blur-md bg-gradient-to-br from-card/40 to-card/10 border border-border/30 rounded-2xl p-6 shadow-lg shadow-foreground/5 hover:shadow-xl hover:shadow-foreground/10 hover:border-ring/40 transition-all duration-300">
                {/* Shine effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-semibold text-foreground text-lg leading-tight mb-3 line-clamp-2 group-hover:text-ring transition-colors duration-200">
                    {module.title}
                  </h3>

                  {/* URL indicator */}
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <div className="w-2 h-2 bg-ring/60 rounded-full" />
                    <span className="font-mono opacity-75">Module Link</span>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-6 h-6 rounded-full bg-ring/20 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-ring"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookMarkedModules;
