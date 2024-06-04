export const PrismaClientErrorCode = {
  BAD_REQUEST: 'P2000',
  CONFLICT: 'P2002',
  NOT_FOUND: 'P2025',
};

export const Messages = {
  ACCESS_DENIED: 'Access Denied',
  NOT_ALLOWED: 'You are not allowed to perform this action',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  ACCEPTED_ANSWER_EXIST:
    'There is already an accepted answer for this question',
};

export const DynamicMessage = {
  CRUD: {
    createSuccess: (field: string) => `Create ${field} successfully`,
    getSuccess: (field: string) => `Get ${field} successfully`,
    updateSuccess: (field: string) => `Update ${field} successfully`,
    deleteSuccess: (field: string) => `Delete ${field} successfully`,
  },
  actionSuccess: (field: string) => `${field} successful`,
  duplicate: (field: string) => `${field} already exists`,
  invalid: (field: string) => `Invalid ${field}`,
  notFound: (field: string) => `${field} not found`,
};

export const tagsSeedData = [
  { name: 'Calculus 1', description: 'Calculus 1 is a subject ...' },
  { name: 'Calculus 2', description: 'Calculus 2 is a subject ...' },
  { name: 'Calculus 3', description: 'Calculus 3 is a subject ...' },
  {
    name: 'Probability statistics',
    description: 'Probability statistics is a subject ...',
  },
  {
    name: 'Linear algebra',
    description: 'Linear algebra is a subject ...',
  },
];
