import { LANGUAGES_MAP } from '@/static-data/languages';

export type ModuleFormType = {
  type?: 'edit' | 'create';
};

export const getModuleFormData = (type: ModuleFormType['type']) => {
  return {
    title: type === 'edit' ? 'Edit Module' : 'Create Module',
    buttonText: type === 'edit' ? 'Update' : 'Create',
  };
};

export const languages = Object.values(LANGUAGES_MAP);
