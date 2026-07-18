import * as Types from '../types';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const mockUsers: Types.User[] = [
  { id: 'U001', name: 'Anirudh Yadav', email: 'anirudhpsyadav@gmail.com', role: 'admin', status: 'active', last_login: hoursAgo(1), created_at: daysAgo(90), avatar_url: '' },
  { id: 'U002', name: 'Rahul Gupta', email: 'rahul@artha.ai', role: 'ceo', status: 'active', last_login: hoursAgo(3), created_at: daysAgo(90), avatar_url: '' },
  { id: 'U003', name: 'Prashant Singh', email: 'prashant@artha.ai', role: 'sales_head', status: 'active', last_login: hoursAgo(2), created_at: daysAgo(60), avatar_url: '' },
  { id: 'U004', name: 'Syed Ahmed', email: 'syed@artha.ai', role: 'country_head', status: 'active', country: 'UAE', last_login: daysAgo(1), created_at: daysAgo(45), avatar_url: '' },
  { id: 'U005', name: 'Maria Santos', email: 'maria@artha.ai', role: 'country_head', status: 'active', country: 'Singapore', last_login: hoursAgo(5), created_at: daysAgo(45), avatar_url: '' },
  { id: 'U006', name: 'Rohit Kapoor', email: 'rohit@artha.ai', role: 'sales_rep', status: 'active', last_login: hoursAgo(1), created_at: daysAgo(30), avatar_url: '' },
  { id: 'U007', name: 'Sneha Reddy', email: 'sneha@artha.ai', role: 'sales_rep', status: 'active', last_login: hoursAgo(4), created_at: daysAgo(30), avatar_url: '' },
  { id: 'U008', name: 'Kartik Menon', email: 'kartik@artha.ai', role: 'sales_rep', status: 'invited', last_login: '', created_at: daysAgo(2), avatar_url: '' },
];

// ---------------------------------------------------------------------------
// ACTIVITY FEED
// ---------------------------------------------------------------------------

export const mockRolePermissions: Types.RolePermissions[] = [
  {
    role: 'admin',
    label: 'Developer / Admin',
    permissions: [
      { module: 'leads', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { module: 'whatsapp', actions: ['view', 'take_over'] },
      { module: 'appointments', actions: ['view', 'manage'] },
      { module: 'knowledge_base', actions: ['view', 'upload', 'delete'] },
      { module: 'users', actions: ['view', 'create', 'edit', 'delete', 'manage'] },
      { module: 'roles', actions: ['view', 'manage'] },
      { module: 'settings', actions: ['view', 'manage'] },
    ],
  },
  {
    role: 'ceo',
    label: 'CEO',
    permissions: [
      { module: 'leads', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { module: 'whatsapp', actions: ['view', 'take_over'] },
      { module: 'appointments', actions: ['view', 'manage'] },
      { module: 'knowledge_base', actions: ['view', 'upload', 'delete'] },
      { module: 'users', actions: ['view'] },
      { module: 'roles', actions: ['view'] },
      { module: 'settings', actions: ['view'] },
    ],
  },
  {
    role: 'country_head',
    label: 'Country Head',
    permissions: [
      { module: 'leads', actions: ['view', 'create', 'edit', 'export'] },
      { module: 'whatsapp', actions: ['view', 'take_over'] },
      { module: 'appointments', actions: ['view', 'manage'] },
      { module: 'knowledge_base', actions: ['view', 'upload', 'delete'] },
      { module: 'users', actions: ['view'] },
      { module: 'roles', actions: ['view'] },
      { module: 'settings', actions: [] },
    ],
  },
  {
    role: 'sales_head',
    label: 'Sales Head',
    permissions: [
      { module: 'leads', actions: ['view', 'create', 'edit', 'export'] },
      { module: 'whatsapp', actions: ['view', 'take_over'] },
      { module: 'appointments', actions: ['view', 'manage'] },
      { module: 'knowledge_base', actions: ['view', 'upload', 'delete'] },
      { module: 'users', actions: ['view'] },
      { module: 'roles', actions: [] },
      { module: 'settings', actions: [] },
    ],
  },
  {
    role: 'sales_rep',
    label: 'Sales Rep / Staff',
    permissions: [
      { module: 'leads', actions: ['view'] },
      { module: 'whatsapp', actions: ['view', 'take_over'] },
      { module: 'appointments', actions: ['view'] },
      { module: 'knowledge_base', actions: ['view'] },
      { module: 'users', actions: [] },
      { module: 'roles', actions: [] },
      { module: 'settings', actions: [] },
    ],
  },
];


