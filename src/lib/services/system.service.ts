import { User, RolePermissions, SystemStatus } from '../types';
import { mockUsers, mockRolePermissions, mockSystemStatus } from '../mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getUsers(): Promise<User[]> {
  await delay(100);
  return [...mockUsers];
}

export async function getRolePermissions(): Promise<RolePermissions[]> {
  await delay(50);
  return [...mockRolePermissions];
}

export async function getSystemStatus(): Promise<SystemStatus> {
  await delay(50);
  return { ...mockSystemStatus };
}
