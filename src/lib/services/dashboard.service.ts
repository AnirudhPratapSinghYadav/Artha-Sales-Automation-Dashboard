import { DashboardKPIs, TrendDataPoint, LeadDistribution, ActivityEvent } from '../types';
import { mockDashboardKPIs, mockTrendData, mockLeadDistribution, mockActivityFeed } from '../mocks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getDashboardKPIs(period?: string): Promise<DashboardKPIs> {
  await delay(100);
  return { ...mockDashboardKPIs };
}

export async function getLeadTrend(period?: string): Promise<TrendDataPoint[]> {
  await delay(100);
  return [...mockTrendData];
}

export async function getLeadDistributionData(): Promise<LeadDistribution[]> {
  await delay(50);
  return [...mockLeadDistribution];
}

export async function getActivityFeed(limit: number = 15): Promise<ActivityEvent[]> {
  await delay(100);
  return mockActivityFeed.slice(0, limit);
}
