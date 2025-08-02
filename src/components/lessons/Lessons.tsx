import { Outlet, useNavigate, useParams } from 'react-router';
import { Button } from '../ui/button';
import { routes } from '@/static-data/routes';
import { deleteLesson } from '@/services/lesson';
import { axiosInstance } from '@/utils/axiosInstance';
import { lessonKeys } from '@/tanstack/keys/lessonKeys';
import { useMutation } from '@tanstack/react-query';

const Lessons = () => {
  const { courseId = '', lessonId = '' } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const handleEditLesson = () => {
    navigate(routes.LESSON_EDIT(courseId, lessonId));
  };

  const { mutate: deleteLessonMutation } = useMutation({
    mutationKey: lessonKeys.delete(courseId, lessonId),
    mutationFn: async () => {
      return deleteLesson(axiosInstance, { courseId, id: lessonId });
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: 'Lesson deleted successfully',
      invalidatesQueries: lessonKeys.all(courseId),
    },
  });

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Lesson</h1>
      <div className='flex mb-4'>
        <Button
          onClick={handleEditLesson}
          className='bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2'
        >
          Edit
        </Button>
        <Button
          onClick={() => deleteLessonMutation()}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Delete
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default Lessons;
