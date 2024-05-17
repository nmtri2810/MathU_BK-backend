export enum Role {
  ADMIN = 1,
  MODERATOR = 2,
  USER = 3,
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Modify_Itself = 'modify_itself',
}
