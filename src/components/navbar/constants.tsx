import { routes } from "@/static-data/routes";

const appName = "Aether Learn";

const navLinks = [
  {
    title: "Home",
    url: routes.HOME,
  },
  {
    title: "Courses",
    url: routes.COURSES,
  },
  {
    title: "Bookmarks",
    url: routes.BOOKMARKED_MODULES,
  },
];

export const navbarConstants = {
  appName,
  navLinks,
};
