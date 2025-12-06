import { OrganizationCourseUpdateSchema } from "@/types/Organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import {
  addOrganizationCourses,
  removeOrganizationCourses,
} from "@/services/organization";
import { axiosInstance } from "@/utils/axiosInstance";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { routes } from "@/static-data/routes";
import { getCourses, getNonOrganizationCourses } from "@/services/course";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import {
  getOrganizationCoursesEditFormData,
  type IformType,
} from "./constants";
import { BookOpen, Search, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";

const OrganizationEditCourseForm = () => {
  const { organizationId = "" } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formType: IformType =
    searchParams.get("type") === "remove" ? "remove" : "add";

  const { title, btnText, description } =
    getOrganizationCoursesEditFormData(formType);

  const form = useForm<z.infer<typeof OrganizationCourseUpdateSchema>>({
    resolver: zodResolver(OrganizationCourseUpdateSchema),
    defaultValues: { courseIds: [] },
  });

  const { data: courses } = useSuspenseQuery({
    queryKey:
      formType === "add"
        ? courseKeys.allNonOrganization(organizationId)
        : courseKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return formType === "add"
        ? getNonOrganizationCourses(axiosInstance, { organizationId })
        : getCourses(axiosInstance, { organizationId });
    },
    select: (data) => data.courses,
  });

  const { mutate: addCourses, isPending: adding } = useMutation({
    mutationKey: organizationKeys.addCourses(organizationId),
    mutationFn: async (courseIds: string[]) => {
      return addOrganizationCourses(
        axiosInstance,
        { id: organizationId },
        { courseIds }
      );
    },
    meta: {
      notify: true,
      successMessage: "Courses added successfully",
      invalidatesQueries: [
        courseKeys.getByOrganization(organizationId),
        courseKeys.allNonOrganization(organizationId),
        organizationKeys.getById(organizationId),
      ],
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  const { mutate: removeCourses, isPending: removing } = useMutation({
    mutationKey: organizationKeys.removeCourses(organizationId),
    mutationFn: async (courseIds: string[]) => {
      return removeOrganizationCourses(
        axiosInstance,
        { id: organizationId },
        { courseIds }
      );
    },
    meta: {
      notify: true,
      successMessage: "Courses removed successfully",
      invalidatesQueries: [
        courseKeys.getByOrganization(organizationId),
        courseKeys.allNonOrganization(organizationId),
        organizationKeys.getById(organizationId),
      ],
    },
    onSettled: () => {
      form.reset();
      navigate(routes.ORGANIZATION_DETAILS(organizationId));
    },
  });

  function onSubmit(data: z.infer<typeof OrganizationCourseUpdateSchema>) {
    if (formType === "add") addCourses(data.courseIds);
    else removeCourses(data.courseIds);
  }

  // Local search for convenience (no logic change)
  const [query, setQuery] = useState("");
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (!query.trim()) return courses;
    const q = query.toLowerCase();
    return courses.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [courses, query]);

  const loading = adding || removing;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Organization Courses
          </p>
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(routes.ORGANIZATION_DETAILS(organizationId))}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to details
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            {formType === "add"
              ? "Assign new courses to the organization."
              : "Remove courses from the organization."}
          </div>
        </div>

        <div className="space-y-6 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search courses by name or description"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <span className="rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground">
                  {filteredCourses?.length || 0} found
                </span>
              </div>

              <FormField
                control={form.control}
                name="courseIds"
                render={() => (
                  <FormItem>
                    <div className="rounded-xl border border-border/60">
                      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-sm text-muted-foreground">
                        <span>Courses</span>
                        <span className="text-xs">Check to select</span>
                      </div>
                      <div className="max-h-80 divide-y divide-border/60 overflow-auto">
                        {filteredCourses?.map((course) => (
                          <FormField
                            key={course.id}
                            control={form.control}
                            name="courseIds"
                            render={({ field }) => (
                              <FormItem className="flex items-start gap-3 px-4 py-3">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(course.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            course.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (v) => v !== course.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="flex-1 cursor-pointer">
                                  <p className="font-medium text-foreground">
                                    {course.name}
                                  </p>
                                  {course.description && (
                                    <span className="text-xs text-muted-foreground">
                                      {course.description}
                                    </span>
                                  )}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                        {filteredCourses?.length === 0 && (
                          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                            No courses match the search.
                          </div>
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate(routes.ORGANIZATION_DETAILS(organizationId))
                  }
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || form.watch("courseIds").length === 0}
                >
                  {loading ? "Processing…" : btnText}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationEditCourseForm;
