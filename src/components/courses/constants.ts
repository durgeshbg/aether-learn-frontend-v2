export type CourseFormType = {
  type?: 'edit' | 'create';
};

export const getCourseFormData = (type: CourseFormType['type']) => {
  return {
    title: type === 'edit' ? 'Edit Course' : 'Create Course',
    buttonText: type === 'edit' ? 'Update' : 'Create',
  };
};
