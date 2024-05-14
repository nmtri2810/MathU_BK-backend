export const PrismaClientErrorCode = {
  BAD_REQUEST: 'P2000',
  CONFLICT: 'P2002',
  NOT_FOUND: 'P2025',
};

export const Messages = {
  ACCESS_DENIED: 'Access Denied',
  INTERNAL_SERVER_ERROR: 'Internal server error',
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
