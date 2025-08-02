import { deleteCourse, getCourseById } from '@/services/course';
import { getLessons } from '@/services/lesson';
import { courseKeys } from '@/tanstack/keys/courseKeys';
import { lessonKeys } from '@/tanstack/keys/lessonKeys';
import type { Course } from '@/types/Course';
import type { Lesson } from '@/types/Lesson';
import { axiosInstance } from '@/utils/axiosInstance';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router';
import { Button } from '../ui/button';
import { routes } from '@/static-data/routes';

const CourseDetails = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { data: course } = useSuspenseQuery({
    queryKey: courseKeys.getById(courseId),
    queryFn: async () => {
      return getCourseById(axiosInstance, { id: courseId });
    },
    select: (data: { course: Course }) => data.course,
  });

  const { data: lessons } = useSuspenseQuery({
    queryKey: lessonKeys.all(courseId),
    queryFn: async () => {
      return getLessons(axiosInstance, { courseId });
    },
    select: (data: { lessons: Lesson[] }) => data.lessons,
  });

  const { mutate: deleteCourseMutation } = useMutation({
    mutationKey: courseKeys.delete(courseId),
    mutationFn: async () => {
      return deleteCourse(axiosInstance, { id: courseId });
    },
    onSuccess: () => {
      navigate(routes.COURSES);
    },
    meta: {
      notify: true,
      successMessage: 'Course deleted successfully',
      invalidatesQueries: courseKeys.all(),
    },
  });

  return (
    <div className='p-4 shadow-md rounded-lg'>
      <h2 className='text-xl font-semibold mb-4'>Course Details</h2>
      <div className='flex mb-4'>
        <Button
          className='bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2'
          onClick={() => navigate(routes.COURSE_EDIT(course.id))}
        >
          Edit
        </Button>
        <Button
          className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={() => deleteCourseMutation()}
        >
          Delete
        </Button>

        <Button
          className='bg-green-500 text-white px-4 py-2 rounded ml-2'
          onClick={() => navigate(routes.LESSON_CREATE(course.id))}
        >
          Add Lesson
        </Button>
      </div>
      <div className='mb-2'>
        <strong>Name:</strong> {course.name}
      </div>
      <div className='mb-2'>
        <strong>Description:</strong> {course.description}
      </div>
      <div className='mb-4'>
        <strong>Lessons:</strong>
        <ul className='list-disc pl-5'>
          {lessons.map((lesson) => (
            <li key={lesson.id} className='mb-1'>
              <Link
                to={routes.LESSON_DETAILS(courseId, lesson.id)}
                className='text-blue-600 hover:underline'
              >
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetails;
