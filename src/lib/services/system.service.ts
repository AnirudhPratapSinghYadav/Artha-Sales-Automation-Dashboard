import { User, RolePermissions, SystemStatus } from '../types';

export async function getUsers(): Promise<User[]> {
  return [];
}

export async function getRolePermissions(): Promise<RolePermissions[]> {
  return [];
}

export async function getSystemStatus(): Promise<SystemStatus> {
  return {
    is_healthy: true,
    last_backup: new Date().toISOString(),
    version: '1.0.0',
    active_integrations: 1,
    storage_used_mb: 100,
    storage_limit_mb: 1000
  };
}
