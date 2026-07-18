export type UserRole = 'admin' | 'ceo' | 'country_head' | 'sales_head' | 'sales_rep';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited' | 'disabled';
  country?: string;
  last_login: string;
  created_at: string;
  avatar_url?: string;
}

export interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

export type PermissionModule =
  | 'leads'
  | 'whatsapp'
  | 'appointments'
  | 'knowledge_base'
  | 'users'
  | 'roles'
  | 'settings';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'export'
  | 'manage'
  | 'upload'
  | 'take_over';

export interface RolePermissions {
  role: UserRole;
  label: string;
  permissions: Permission[];
}
