import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { User, PermissionModule, PermissionAction, RolePermissions } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dummyAdmin: User = {
  id: 'dummy-admin-id',
  email: 'admin@thinkartha.com',
  name: 'Admin User',
  role: 'admin',
  status: 'active',
  last_login: new Date().toISOString(),
  created_at: new Date().toISOString()
};

const dummyPermissions: RolePermissions = {
  role: 'admin',
  label: 'Admin',
  permissions: [
    { module: 'leads', actions: ['view', 'edit', 'delete'] },
    { module: 'whatsapp', actions: ['view', 'edit', 'delete'] },
    { module: 'appointments', actions: ['view', 'edit', 'delete'] },
    { module: 'settings', actions: ['view', 'edit', 'delete'] },
    { module: 'users', actions: ['view', 'edit', 'delete'] },
    { module: 'knowledge_base', actions: ['view', 'edit', 'delete', 'upload', 'manage'] },
  ]
};

export async function verifyUser(req: NextRequest): Promise<User | null> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return dummyAdmin; // Default to dummy admin since auth is disabled
    }
    
    return dummyAdmin;
  } catch (error) {
    console.error('API Verify User error:', error);
    return null;
  }
}

export function hasPermission(user: User, module: PermissionModule, action: PermissionAction): boolean {
  return true; // Bypass permission check
}
