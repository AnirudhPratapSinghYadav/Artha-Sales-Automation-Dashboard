'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '@/lib/types';
import { getUsers } from '@/lib/data';
import { getRoleLabel, getRoleBadgeColor, useAuth } from '@/lib/auth';
import { SearchInput } from '@/components/ui/SearchInput';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeletons';
import { CheckCircle2, ChevronDown, User as UserIcon, Shield } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '@/components/ui/ToastProvider';

export default function RolesAssignmentPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const isAdmin = currentUser?.role === 'admin';
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        toast({ title: 'Error', message: 'Failed to load users', variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  // Click outside listener for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableRoles: { id: UserRole, label: string, desc: string }[] = [
    { id: 'admin', label: 'System Admin', desc: 'Full access to all modules and settings' },
    { id: 'ceo', label: 'CEO', desc: 'View all data and high-level reports' },
    { id: 'country_head', label: 'Country Head', desc: 'Manage regional sales and teams' },
    { id: 'sales_head', label: 'Sales Head', desc: 'Oversee sales pipeline and reps' },
    { id: 'sales_rep', label: 'Sales Rep', desc: 'Manage own leads and appointments' },
  ];

  const handleAssignRole = () => {
    if (!selectedUser || !selectedRole) return;
    
    // Optimistic update
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: selectedRole } : u));
    toast({ title: 'Role Updated', message: `Successfully assigned ${getRoleLabel(selectedRole)} role to ${selectedUser.name}. Alert sent to user.`, variant: 'success' });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-10 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100 tracking-tight">Assign Roles</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Select a user from the directory to assign or change their system role.</p>
        {!isAdmin && (
          <div className="mt-4 text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 inline-flex px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-900">
            View-only mode. Only system administrators can change permissions.
          </div>
        )}
      </div>

      <Card className="p-6 overflow-visible shadow-sm border-gray-200/60 dark:border-zinc-800/60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: User Selection */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              1. Select User
            </label>
            
            <div className="relative" ref={dropdownRef}>
              <div 
                className={clsx(
                  "w-full px-4 py-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all",
                  isDropdownOpen ? "border-primary-500 ring-2 ring-primary-500/20" : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 bg-gray-50/50 dark:bg-zinc-900/50"
                )}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedUser ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-zinc-100 leading-none">{selectedUser.name}</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{selectedUser.email}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-zinc-400">Search for a user...</span>
                )}
                <ChevronDown className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              </div>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 max-h-80 flex flex-col overflow-hidden">
                  <div className="p-2 border-b border-gray-100 dark:border-zinc-800">
                    <SearchInput 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onChange={(val) => setSearchQuery(val)}
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto flex-1 p-2">
                    {filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-zinc-400">No users found.</div>
                    ) : (
                      filteredUsers.map(u => (
                        <div 
                          key={u.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedUser(u);
                            setSelectedRole(u.role);
                            setIsDropdownOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 flex items-center justify-center font-bold text-sm">
                              {u.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">{u.name}</span>
                              <span className="text-xs text-gray-500 dark:text-zinc-400">{u.email}</span>
                            </div>
                          </div>
                          <Badge variant="dormant" className="bg-gray-100 text-gray-600 border-none">
                            {getRoleLabel(u.role)}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Role Selection */}
          <div className={clsx("flex flex-col gap-4 transition-opacity duration-300", !selectedUser && "opacity-40 pointer-events-none")}>
            <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              2. Assign Role
            </label>
            
            <div className="flex flex-col gap-3">
              {availableRoles.map(role => (
                <label 
                  key={role.id}
                  className={clsx(
                    "flex flex-col p-4 border rounded-xl cursor-pointer transition-all",
                    selectedRole === role.id 
                      ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 ring-1 ring-primary-500" 
                      : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-4 h-4 rounded-full border flex items-center justify-center",
                        selectedRole === role.id ? "border-primary-600 bg-primary-600" : "border-gray-300 dark:border-zinc-700"
                      )}>
                        {selectedRole === role.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-zinc-100">{role.label}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 pl-7">{role.desc}</p>
                  
                  {/* Hidden radio for accessibility */}
                  <input 
                    type="radio" 
                    name="role" 
                    value={role.id} 
                    checked={selectedRole === role.id}
                    onChange={() => setSelectedRole(role.id)}
                    className="sr-only"
                    disabled={!isAdmin || !selectedUser}
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAssignRole}
                disabled={!isAdmin || !selectedUser || selectedRole === selectedUser?.role}
                className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Assignment
              </button>
            </div>
            {!isAdmin && selectedUser && (
              <p className="text-xs text-amber-600 text-right mt-2">You need administrator privileges to save changes.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
