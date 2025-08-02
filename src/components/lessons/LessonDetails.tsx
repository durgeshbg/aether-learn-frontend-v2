import { getLessonById } from '@/services/lesson';
import { lessonKeys } from '@/tanstack/keys/lessonKeys';
import type { Lesson } from '@/types/Lesson';
import { axiosInstance } from '@/utils/axiosInstance';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

const LessonDetails = () => {
  const { courseId = '', lessonId = '' } = useParams<{
    courseId: string;
    lessonId: string;
  }>();

  const { data: lesson } = useSuspenseQuery({
    queryKey: lessonKeys.getById(courseId, lessonId),
    queryFn: async () => {
      return getLessonById(axiosInstance, { courseId, id: lessonId });
    },
    select: (data: { lesson: Lesson }) => data.lesson,
  });

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Lesson Details</h1>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold'>Title</h2>
        <p>{lesson.title}</p>
      </div>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold'>Content</h2>
        <p>{lesson.content}</p>
      </div>
    </div>
  );
};

export default LessonDetails;
