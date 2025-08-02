import { useAuth } from '@/hooks/useAuth';
import { getCourses } from '@/services/course';
import { routes } from '@/static-data/routes';
import { courseKeys } from '@/tanstack/keys/courseKeys';
import type { Course } from '@/types/Course';
import { axiosInstance } from '@/utils/axiosInstance';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

const CoursesList = () => {
  const { user } = useAuth();
  const { data: courses } = useSuspenseQuery({
    queryKey: courseKeys.all(),
    queryFn: async () => {
      return getCourses(axiosInstance, {
        organizationId: user?.organization?.id,
      });
    },
    select: (data: { courses: Course[] }) => data.courses,
  });

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Courses List</h2>
      <ul className='list-disc pl-5'>
        {courses.map((course: Course) => (
          <li key={course.id} className='mb-2'>
            <Link
              to={routes.COURSE_DETAILS(course.id)}
              className='text-blue-600 hover:underline'
            >
              {course.name}
              <span className='text-gray-500'> - {course.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesList;
