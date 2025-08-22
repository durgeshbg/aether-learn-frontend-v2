import { getOrganizations } from "@/services/organization";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import type { Organization } from "@/types/Organization";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  Search,
  Filter,
  GraduationCap,
  Award,
  BookOpen,
  School,
} from "lucide-react";

// Dummy data enhancement for colleges
const enhanceCollegeData = (org: Organization) => ({
  ...org,
  logo: `https://api.dicebear.com/7.x/initials/svg?seed=${org.name}&backgroundColor=random`,
  location: [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Boston, MA",
    "Seattle, WA",
  ][Math.floor(Math.random() * 5)],
  studentCount: Math.floor(Math.random() * 15000) + 2000,
  facultyCount: Math.floor(Math.random() * 800) + 100,
  establishedYear: 1950 + Math.floor(Math.random() * 74),
  website: `https://${org.name.toLowerCase().replace(/\s+/g, "")}.edu`,
  programs: Math.floor(Math.random() * 40) + 15,
  isActive: Math.random() > 0.1, // 90% active
  campusSize: Math.floor(Math.random() * 500) + 50, // acres
  accreditation: ["NAAC A+", "NAAC A", "UGC Approved", "AICTE Approved"][
    Math.floor(Math.random() * 4)
  ],
});

const OrganizationsList = () => {
  const navigate = useNavigate();
  const { data: organizations } = useSuspenseQuery({
    queryKey: organizationKeys.all(),
    queryFn: async () => {
      return getOrganizations(axiosInstance);
    },
    select: (data: { organizations: Organization[] }) =>
      data.organizations?.map(enhanceCollegeData) || [],
  });

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Colleges Directory
            </h2>
            <p className="text-sm text-muted-foreground">
              {organizations?.length || 0} colleges in the network
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-card/40 backdrop-blur-sm border-border/40"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-card/40 backdrop-blur-sm border-border/40"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations?.map((college) => (
          <div
            key={college.id}
            className="group relative overflow-hidden rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 hover:border-border/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            onClick={() => navigate(routes.ORGANIZATION_DETAILS(college.id))}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative p-6 space-y-4">
              {/* Header with logo and status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={college.logo}
                      alt={college.name}
                      className="w-12 h-12 rounded-full bg-muted border-2 border-border/20"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 ${college.isActive ? "bg-green-500" : "bg-red-500"} rounded-full border-2 border-background`}
                    ></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {college.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {college.location}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-700 border border-blue-500/30">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  College
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {college.description ||
                  "A premier educational institution committed to academic excellence, innovation, and holistic student development."}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">
                    {college.studentCount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    students
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">
                    {college.programs}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    programs
                  </span>
                </div>
              </div>

              {/* College Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Est. {college.establishedYear}</span>
                  <span className="mx-2">•</span>
                  <Award className="h-4 w-4" />
                  <span>{college.accreditation}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span className="truncate">{college.website}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{college.campusSize} acres campus</span>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="pt-3 border-t border-border/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {college.facultyCount} faculty members
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${college.isActive ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {college.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {(!organizations || organizations.length === 0) && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No colleges found
          </h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first college to the network.
          </p>
          <Button onClick={() => navigate(routes.ORGANIZATION_CREATE)}>
            <GraduationCap className="h-4 w-4 mr-2" />
            Add College
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrganizationsList;
