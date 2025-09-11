import {
  deleteOrganization,
  getOrganizationById,
} from "@/services/organization";
import { routes } from "@/static-data/routes";
import { organizationKeys } from "@/tanstack/keys/organizationKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { getNonOrganizationUsers, getUsers } from "@/services/user";
import { getCourses, getNonOrganizationCourses } from "@/services/course";
import { userKeys } from "@/tanstack/keys/userKeys";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  Edit3,
  Trash2,
  Shield,
  GraduationCap,
  BookOpen,
  UserPlus,
  UserMinus,
  Plus,
  Minus,
  Award,
  School,
  Mail,
} from "lucide-react";
import { useState } from "react";

const OrganizationDetails = () => {
  const { organizationId = "" } = useParams<{
    organizationId: string;
  }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: organization } = useSuspenseQuery({
    queryKey: organizationKeys.getById(organizationId),
    queryFn: async () => {
      return getOrganizationById(axiosInstance, { id: organizationId || "" });
    },
    select: (data) => data.organization,
  });

  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return getUsers(axiosInstance, { organizationId });
    },
    select: (data) => data.users,
  });

  const { data: nonOrgUsers } = useSuspenseQuery({
    queryKey: userKeys.allNonOrganization(),
    queryFn: async () => {
      return getNonOrganizationUsers(axiosInstance);
    },
    select: (data) => data.users,
  });

  const { data: courses } = useSuspenseQuery({
    queryKey: courseKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return getCourses(axiosInstance, { organizationId });
    },
    select: (data) => data.courses,
  });

  const { data: nonOrgCourses } = useSuspenseQuery({
    queryKey: courseKeys.allNonOrganization(organizationId),
    queryFn: async () => {
      return getNonOrganizationCourses(axiosInstance, { organizationId });
    },
    select: (data) => data.courses,
  });

  const { mutate: deleteOrganizationMutation, isPending } = useMutation({
    mutationKey: organizationKeys.delete(organizationId),
    mutationFn: async (id: string) => {
      return deleteOrganization(axiosInstance, { id });
    },
    meta: {
      notify: true,
      successMessage: "Organization deleted successfully",
      errorMessage: "Failed to delete organization",
      invalidatesQueries: organizationKeys.all(),
    },
    onSettled: () => {
      navigate(routes.ORGANIZATIONS);
    },
  });

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteOrganizationMutation(organizationId);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  // Enhanced organization data
  const enhancedOrganization = {
    ...organization,
    logo: `https://api.dicebear.com/7.x/initials/svg?seed=${organization.name}&backgroundColor=random`,
    location: "Sample Location, State",
    establishedYear: 1985,
    website: `https://${organization.name.toLowerCase().replace(/\s+/g, "")}.edu`,
    email: `info@${organization.name.toLowerCase().replace(/\s+/g, "")}.edu`,
    phone: "+1 (555) 123-4567",
    campusSize: 150,
    accreditation: "NAAC A+",
  };

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(routes.ORGANIZATIONS)}
            className="p-2 hover:bg-card/40 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Organization Details
            </h1>
            <p className="text-muted-foreground">
              Comprehensive overview and management
            </p>
          </div>
        </div>

        {/* Organization Profile Card */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <img
                  src={enhancedOrganization.logo}
                  alt={organization.name}
                  className="w-24 h-24 rounded-2xl bg-muted border-4 border-background shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {organization.name}
                </h2>
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {organization.description ||
                    "A premier educational institution committed to academic excellence and student success."}
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {enhancedOrganization.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        Est. {enhancedOrganization.establishedYear}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {enhancedOrganization.accreditation}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {enhancedOrganization.website}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {enhancedOrganization.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {enhancedOrganization.campusSize} acres campus
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="p-8 border-b border-border/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              Management Actions
            </h3>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-blue-500/10 border-blue-500/20 text-blue-700 hover:bg-blue-500/20"
                onClick={() =>
                  navigate(routes.ORGANIZATION_EDIT(organizationId))
                }
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Organization
              </Button>

              <Button
                variant="outline"
                className="bg-purple-500/10 border-purple-500/20 text-purple-700 hover:bg-purple-500/20"
                onClick={() =>
                  navigate(routes.ORGANIZATION_EDIT_ADMIN(organizationId))
                }
              >
                <Shield className="h-4 w-4 mr-2" />
                Edit Admin
              </Button>

              <Button
                variant="outline"
                className={`transition-all duration-300 ${
                  showDeleteConfirm
                    ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                    : "bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20"
                }`}
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {showDeleteConfirm ? "Confirm Delete" : "Delete Organization"}
              </Button>
            </div>

            {showDeleteConfirm && (
              <p
                className="
                mt-4 text-sm text-red-500 bg-red-100 p-3 rounded-lg
                border border-red-200
              "
              >
                ⚠️ Click "Confirm Delete" again to permanently remove this
                organization. This action cannot be undone.
              </p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-card/40 backdrop-blur-md border border-border/20 p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {users?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Students</div>
          </div>

          <div className="rounded-xl bg-card/40 backdrop-blur-md border border-border/20 p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {courses?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Courses</div>
          </div>

          <div className="rounded-xl bg-card/40 backdrop-blur-md border border-border/20 p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <School className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {nonOrgUsers?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Available Students
            </div>
          </div>

          <div className="rounded-xl bg-card/40 backdrop-blur-md border border-border/20 p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {nonOrgCourses?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Available Courses
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Students Section */}
          <div className="space-y-6">
            {/* Enrolled Students */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Enrolled Students ({users?.length || 0})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20"
                  onClick={() =>
                    navigate(
                      routes.ORGANIZATION_EDIT_USERS_REMOVE(organizationId),
                    )
                  }
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Remove Students
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/10"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-sm">
                    No students enrolled
                  </p>
                )}
              </div>
            </div>

            {/* Available Students */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Available Students ({nonOrgUsers?.length || 0})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-500/10 border-green-500/20 text-green-700 hover:bg-green-500/20"
                  onClick={() =>
                    navigate(routes.ORGANIZATION_EDIT_USERS_ADD(organizationId))
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Students
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nonOrgUsers?.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/10"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-sm">
                    No available students
                  </p>
                )}
                {nonOrgUsers && nonOrgUsers.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{nonOrgUsers.length - 5} more students available
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="space-y-6">
            {/* Active Courses */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Active Courses ({courses?.length || 0})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20"
                  onClick={() =>
                    navigate(
                      routes.ORGANIZATION_EDIT_COURSES_REMOVE(organizationId),
                    )
                  }
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Remove Courses
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {courses?.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 rounded-lg bg-muted/10 border border-border/10"
                  >
                    <p className="font-medium text-sm">{course.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-sm">
                    No active courses
                  </p>
                )}
              </div>
            </div>

            {/* Available Courses */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Available Courses ({nonOrgCourses?.length || 0})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-green-500/10 border-green-500/20 text-green-700 hover:bg-green-500/20"
                  onClick={() =>
                    navigate(
                      routes.ORGANIZATION_EDIT_COURSES_ADD(organizationId),
                    )
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Courses
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {nonOrgCourses?.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="p-3 rounded-lg bg-muted/10 border border-border/10"
                  >
                    <p className="font-medium text-sm">{course.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-sm">
                    No available courses
                  </p>
                )}
                {nonOrgCourses && nonOrgCourses.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    +{nonOrgCourses.length - 5} more courses available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
