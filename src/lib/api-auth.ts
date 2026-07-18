import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mockUsers, mockRolePermissions } from './mocks';
import { User, PermissionModule, PermissionAction } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';

/**
 * Validates the Authorization header against Supabase (or mock users in local fallback mode).
 * Returns the authenticated user object, or null if unauthorized.
 */
export async function verifyUser(req: NextRequest): Promise<User | null> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];

    if (isSupabaseConfigured) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return null;
      
      const matched = mockUsers.find(u => u.email.toLowerCase() === user.email?.toLowerCase());
      if (matched) return matched;
      
      return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Authenticated User',
        email: user.email || '',
        role: 'sales_rep',
        status: 'active',
        last_login: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
    } else {
      // Local mock fallback validation
      const matched = mockUsers.find(u => u.id === token || u.email.toLowerCase() === token.toLowerCase());
      return matched || null;
    }
  } catch (error) {
    console.error('API Verify User error:', error);
    return null;
  }
}

/**
 * Checks if the authenticated user has permission to perform an action on a module.
 */
export function hasPermission(user: User, module: PermissionModule, action: PermissionAction): boolean {
  const rolePerms = mockRolePermissions.find(rp => rp.role === user.role);
  if (!rolePerms) return false;
  const modulePerm = rolePerms.permissions.find(p => p.module === module);
  if (!modulePerm) return false;
  return modulePerm.actions.includes(action);
}
