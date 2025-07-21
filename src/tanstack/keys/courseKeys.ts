export const courseKeys = {
  all: () => ['courses'] as const,
  create: () => [...courseKeys.all(), 'create'] as const,
  getById: (id: string) => [...courseKeys.all(), id] as const,
  update: (id: string) => [...courseKeys.all(), 'update', id] as const,
  delete: (id: string) => [...courseKeys.all(), 'delete', id],
} as const;
