import * as Types from '../types';

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000).toISOString();

export const mockSystemStatus: Types.SystemStatus = {
  status: 'healthy',
  last_checked: minutesAgo(2),
  message: 'All systems running',
};

// ---------------------------------------------------------------------------
// ROLE PERMISSIONS
// ---------------------------------------------------------------------------

