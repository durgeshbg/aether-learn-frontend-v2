export type LessonFormType = {
  type?: 'edit' | 'create';
};

export const getLessonFormData = (type: LessonFormType['type']) => {
  return {
    title: type === 'edit' ? 'Edit Lesson' : 'Create Lesson',
    buttonText: type === 'edit' ? 'Update' : 'Create',
  };
};
