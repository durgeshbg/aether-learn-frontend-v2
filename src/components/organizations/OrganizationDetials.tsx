import {
  deleteOrganization,
  getOrganizationById,
} from '@/services/organization';
import { routes } from '@/static-data/routes';
import { organizationKeys } from '@/tanstack/keys/organizationKeys';
import { axiosInstance } from '@/utils/axiosInstance';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../ui/button';
import type { Course } from '@/types/Course';
import type { User } from '@/types/User';
import { getNonOrganizationUsers, getUsers } from '@/services/user';
import { getCourses, getNonOrganizationCourses } from '@/services/course';
import { userKeys } from '@/tanstack/keys/userKeys';
import { courseKeys } from '@/tanstack/keys/courseKeys';

const OrganizationDetials = () => {
  const { organizationId = '' } = useParams<{
    organizationId: string;
  }>();
  const navigate = useNavigate();

  const {
    data: { organization },
  } = useSuspenseQuery({
    queryKey: organizationKeys.getById(organizationId),
    queryFn: async () => {
      return getOrganizationById(axiosInstance, { id: organizationId || '' });
    },
  });

  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return getUsers(axiosInstance, { organizationId });
    },
    select: (data: { users: User[] }) => data.users,
  });

  const { data: nonOrgUsers } = useSuspenseQuery({
    queryKey: userKeys.allNonOrganization(),
    queryFn: async () => {
      return getNonOrganizationUsers(axiosInstance);
    },
    select: (data: { users: User[] }) => data.users,
  });

  const { data: courses } = useSuspenseQuery({
    queryKey: courseKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return getCourses(axiosInstance, { organizationId });
    },
    select: (data: { courses: Course[] }) => data.courses,
  });

  const { data: nonOrgCourses } = useSuspenseQuery({
    queryKey: courseKeys.allNonOrganization(organizationId),
    queryFn: async () => {
      return getNonOrganizationCourses(axiosInstance, { organizationId });
    },
    select: (data: { courses: Course[] }) => data.courses,
  });

  const { mutate: deleteOrganizationMutation } = useMutation({
    mutationKey: organizationKeys.delete(organizationId),
    mutationFn: async (id: string) => {
      return deleteOrganization(axiosInstance, { id });
    },
    meta: {
      notify: true,
      successMessage: 'Organization deleted successfully',
      errorMessage: 'Failed to delete organization',
      invalidatesQueries: organizationKeys.all(),
    },
    onSettled: () => {
      navigate(routes.ORGANIZATIONS);
    },
  });

  return (
    <div>
      <div className='p-4'>
        <h2 className='text-2xl font-bold mb-4'>Organization Details</h2>
        <div className='mb-2'>
          <strong>ID:</strong> {organization.id}
        </div>
        <div className='mb-2'>
          <strong>Name:</strong> {organization.name}
        </div>
        <div className='mb-2'>
          <strong>Description:</strong> {organization.description}
        </div>
      </div>
      <div className='p-4'>
        <h3 className='text-xl font-semibold mb-2'>Actions</h3>
        <Button
          variant='outline'
          className='mr-2 bg-blue-500 text-white px-4 py-2 rounded'
          onClick={() => {
            navigate(routes.ORGANIZATION_EDIT(organizationId));
          }}
        >
          Edit Organization
        </Button>
        <Button
          variant='outline'
          className='mr-2 bg-blue-500 text-white px-4 py-2 rounded'
          onClick={() => {
            navigate(routes.ORGANIZATION_EDIT_ADMIN(organizationId));
          }}
        >
          Edit Admin
        </Button>
        <Button
          variant='destructive'
          className='bg-red-500 text-white px-4 py-2 rounded'
          onClick={() => deleteOrganizationMutation(organizationId)}
        >
          Delete Organization
        </Button>
      </div>
      <div className='p-4 flex gap-4 flex-col md:flex-row justify-between items-start'>
        <div className='flex flex-col'>
          <div className='p-4'>
            <h3 className='text-xl font-semibold mb-2'>Users</h3>
            <ul>
              {users.map((user) => (
                <li key={user.id} className='mb-2'>
                  {user.firstName} {user.lastName} ({user.email})
                </li>
              ))}
            </ul>
            <Button
              variant='outline'
              className='mt-4 bg-green-500 text-white px-4 py-2 rounded'
              onClick={() => {
                navigate(routes.ORGANIZATION_EDIT_USERS_REMOVE(organizationId));
              }}
            >
              Remove Users
            </Button>
          </div>

          <div className='p-4'>
            <h3 className='text-xl font-semibold mb-2'>
              Users Not in organization
            </h3>
            <ul>
              {nonOrgUsers.map((user) => (
                <li key={user.id} className='mb-2'>
                  {user.firstName} {user.lastName} ({user.email})
                </li>
              ))}
            </ul>
            <Button
              variant='outline'
              className='mt-4 bg-green-500 text-white px-4 py-2 rounded'
              onClick={() => {
                navigate(routes.ORGANIZATION_EDIT_USERS_ADD(organizationId));
              }}
            >
              Add Users
            </Button>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='p-4'>
            <h3 className='text-xl font-semibold mb-2'>Courses</h3>
            <ul>
              {courses.map((course) => (
                <li key={course.id} className='mb-2'>
                  {course.name} - {course.description}
                </li>
              ))}
            </ul>
            <Button
              variant='outline'
              className='mt-4 bg-green-500 text-white px-4 py-2 rounded'
              onClick={() => {
                navigate(
                  routes.ORGANIZATION_EDIT_COURSES_REMOVE(organizationId)
                );
              }}
            >
              Remove Courses
            </Button>
          </div>
          <div className='p-4'>
            <h3 className='text-xl font-semibold mb-2'>
              Non Organization Courses
            </h3>
            <ul>
              {nonOrgCourses.map((course) => (
                <li key={course.id} className='mb-2'>
                  {course.name} - {course.description}
                </li>
              ))}
            </ul>
            <Button
              variant='outline'
              className='mt-4 bg-green-500 text-white px-4 py-2 rounded'
              onClick={() => {
                navigate(routes.ORGANIZATION_EDIT_COURSES_ADD(organizationId));
              }}
            >
              Add Courses
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetials;
