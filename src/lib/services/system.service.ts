import { User, RolePermissions, SystemStatus } from '../types';

export async function getUsers(): Promise<User[]> {
  return [];
}

export async function getRolePermissions(): Promise<RolePermissions[]> {
  return [];
}

export async function getSystemStatus(): Promise<SystemStatus> {
  return {
    status: 'healthy',
    last_checked: new Date().toISOString(),
    message: 'All systems operational'
  };
}
