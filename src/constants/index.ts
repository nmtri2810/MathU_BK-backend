export const PrismaClientErrorCode = {
  BAD_REQUEST: 'P2000',
  CONFLICT: 'P2002',
  NOT_FOUND: 'P2025',
};

export const ResponseMessages = {
  ACCESS_DENIED: 'Access Denied',

  EMAIL_DUPLICATED: 'Email already exists',
  INVALID_PASSWORD: 'Invalid password',
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Register successful',
  LOGOUT_SUCCESS: 'Logout successful',

  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXIST: 'User already exists',
  CREATE_USER_SUCCESSFULLY: 'Create user successfully',
  GET_USER_SUCCESSFULLY: 'Get user successfully',
  UPDATE_USER_SUCCESSFULLY: 'Update user successfully',
  DELETE_USER_SUCCESSFULLY: 'Delete user successfully',
};

export enum Role {
  ADMIN = 1,
  MODERATOR = 2,
  USER = 3,
}
