import { ChevronUp, Home, LogOut, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { sidebarItems } from "./constants";
import { routes } from "@/static-data/routes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { getCourses } from "@/services/course";
import { axiosInstance } from "@/utils/axiosInstance";
import type { Course } from "@/types/Course";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: courses } = useSuspenseQuery({
    queryKey: courseKeys.all(),
    queryFn: async () => {
      return getCourses(axiosInstance, {
        organizationId: user?.organization?.id,
      });
    },
    select: (data: { courses: Course[] }) => data.courses,
  });

  const courseItems = courses.map((course: Course) => ({
    title: course.name,
    url: routes.COURSE_DETAILS(course.id),
  }));

  const bottommenuitems = [
    {
      name: "Sign out",
      icon: LogOut,
      onClick: () => logout(),
    },
    {
      name: "Profile",
      icon: User2,
      onClick: () => {
        navigate(routes.PROFILE);
      },
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Aether Learn</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(routes.HOME)}
          >
            <span className="sr-only">Go to Home</span>
            <Home />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Courses</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {courseItems.map((course: { title: string; url: string }) => (
                <SidebarMenuItem key={course.title}>
                  <SidebarMenuButton asChild>
                    <Link to={course.url}>
                      <span>{course.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <User2 /> {user && `${user?.firstName} ${user?.lastName}`}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] translate-x-12 -translate-y-2"
              >
                {bottommenuitems.map((item, index) => (
                  <DropdownMenuItem className="cursor-pointer p-0" key={index}>
                    <Button variant={"link"} onClick={item.onClick}>
                      {item.icon && <item.icon className="mr-2" />}
                      <span>{item.name}</span>
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
