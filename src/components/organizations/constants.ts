export type IformType = 'add' | 'remove';

export const getOrganizationUsersEditFormData = (formType: IformType) => {
  const title = formType === 'add' ? 'Add Users' : 'Remove Users';
  const btnText = formType === 'add' ? 'Add Users' : 'Remove Users';
  const description =
    formType === 'add'
      ? 'Select users to add to the organization'
      : 'Select users to remove from the organization';
  return {
    title,
    btnText,
    description,
  };
};

export const getOrganizationCoursesEditFormData = (formType: IformType) => {
  const title = formType === 'add' ? 'Add Courses' : 'Remove Courses';
  const btnText = formType === 'add' ? 'Add Courses' : 'Remove Courses';
  const description =
    formType === 'add'
      ? 'Select courses to add to the organization'
      : 'Select courses to remove from the organization';
  return {
    title,
    btnText,
    description,
  };
};
