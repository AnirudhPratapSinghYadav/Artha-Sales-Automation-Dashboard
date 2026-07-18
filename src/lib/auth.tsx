// =============================================================================
// Artha Sales Automation — Auth Context & Role System
// =============================================================================

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, PermissionModule, PermissionAction, RolePermissions } from './types';
import { mockUsers, mockRolePermissions } from './mocks';
import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Auth Context Types
// ---------------------------------------------------------------------------
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: PermissionModule, action: PermissionAction) => boolean;
  canAccessModule: (module: PermissionModule) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Role Permission Lookup
// ---------------------------------------------------------------------------
function getRolePermissions(role: UserRole): RolePermissions | undefined {
  return mockRolePermissions.find(rp => rp.role === role);
}

// ---------------------------------------------------------------------------
// Auth Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount and setup Supabase listener
  useEffect(() => {
    // 1. Check local fallback (if Supabase isn't configured)
    const checkFallback = () => {
      const stored = localStorage.getItem('artha_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('artha_user');
          localStorage.removeItem('artha_user_id');
        }
      }
      setIsLoading(false);
    };

    // 2. Setup Supabase listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Here we would ideally query the actual users table to get the full profile including Role
        // const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        // setUser(data);
        
        // For now, we simulate matching to our mock db by email
        const matchedUser = mockUsers.find(u => u.email.toLowerCase() === session.user.email?.toLowerCase());
        if (matchedUser) {
          setUser(matchedUser);
        } else {
          // Fallback if not found in mock
          checkFallback();
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Check fallback immediately in case Supabase is placeholder
    checkFallback();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Attempt real auth if connected
    // const { error } = await supabase.auth.signInWithPassword({ email, password: _password });
    // if (!error) return true;

    // Fallback: match against mock users by email
    const matchedUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.status === 'active');
    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem('artha_user', JSON.stringify(matchedUser));
      localStorage.setItem('artha_user_id', matchedUser.id);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('artha_user');
    localStorage.removeItem('artha_user_id');
  }, []);

  const hasPermission = useCallback(
    (module: PermissionModule, action: PermissionAction): boolean => {
      if (!user) return false;
      const rolePerms = getRolePermissions(user.role);
      if (!rolePerms) return false;
      const modulePerm = rolePerms.permissions.find(p => p.module === module);
      if (!modulePerm) return false;
      return modulePerm.actions.includes(action);
    },
    [user]
  );

  const canAccessModule = useCallback(
    (module: PermissionModule): boolean => {
      if (!user) return false;
      const rolePerms = getRolePermissions(user.role);
      if (!rolePerms) return false;
      const modulePerm = rolePerms.permissions.find(p => p.module === module);
      return !!modulePerm && modulePerm.actions.length > 0;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        canAccessModule,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ---------------------------------------------------------------------------
// Role Display Helpers
// ---------------------------------------------------------------------------
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'admin': return 'Admin';
    case 'ceo': return 'CEO';
    case 'country_head': return 'Country Head';
    case 'sales_head': return 'Sales Head';
    case 'sales_rep': return 'Sales Rep';
  }
}

export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-700';
    case 'ceo': return 'bg-purple-100 text-purple-700';
    case 'country_head': return 'bg-blue-100 text-blue-700';
    case 'sales_head': return 'bg-amber-100 text-amber-700';
    case 'sales_rep': return 'bg-gray-100 text-gray-600';
  }
}

/**
 * Returns the authorization header value containing the bearer token (JWT or fallback mock ID).
 */
export async function getAuthHeader(): Promise<string> {
  const sessionRes = await supabase.auth.getSession();
  const session = sessionRes.data?.session;
  if (session?.access_token) {
    return `Bearer ${session.access_token}`;
  }
  
  if (typeof window !== 'undefined') {
    const fallbackId = localStorage.getItem('artha_user_id');
    if (fallbackId) {
      return `Bearer ${fallbackId}`;
    }
  }
  return '';
}
