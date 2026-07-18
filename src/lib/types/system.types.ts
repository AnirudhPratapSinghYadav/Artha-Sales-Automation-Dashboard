export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down';
  last_checked: string;
  message: string;
}

export interface DateRange {
  start: string;
  end: string;
}
