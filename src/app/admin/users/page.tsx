'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { getUsers } from '@/lib/data';
import { getRoleLabel, getRoleBadgeColor, useAuth } from '@/lib/auth';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { TableSkeleton } from '@/components/ui/Skeletons';
import { UserPlus, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '@/components/ui/ToastProvider';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const isAdmin = currentUser?.role === 'admin';
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('sales_rep');

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

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // Stub
    toast({ title: 'Success', message: `Invite sent to ${inviteEmail} as ${inviteRole}`, variant: 'success' });
    setInviteModalOpen(false);
    setInviteEmail('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="active">Active</Badge>;
      case 'invited': return <Badge variant="invited">Invited</Badge>;
      case 'disabled': return <Badge variant="disabled">Disabled</Badge>;
      default: return <Badge variant="disabled">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pb-10 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="h-8 w-44 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
          </div>
          {isAdmin && <div className="h-10 w-32 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg" />}
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">User Management</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Manage team access to the Artha dashboard</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite User
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-zinc-100">
                        {u.name} {u.id === currentUser?.id && <span className="text-xs text-gray-500 dark:text-zinc-400 font-normal ml-1">(You)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-zinc-300">
                    {u.email}
                  </td>
                  <td className="py-4 px-6">
                    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getRoleBadgeColor(u.role))}>
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(u.status)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-zinc-400">
                    {u.last_login ? formatDistanceToNow(parseISO(u.last_login), { addSuffix: true }) : 'Never'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {isAdmin && u.id !== currentUser?.id && (
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={inviteModalOpen} 
        onClose={() => setInviteModalOpen(false)} 
        title="Invite New User"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              placeholder="colleague@artha.ai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="sales_rep">Sales Rep</option>
              <option value="sales_head">Sales Head</option>
              <option value="country_head">Country Head</option>
              <option value="ceo">CEO</option>
              <option value="admin">System Admin</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setInviteModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
