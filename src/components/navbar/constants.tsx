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
];

export const navbarConstants = {
  appName,
  navLinks,
};
