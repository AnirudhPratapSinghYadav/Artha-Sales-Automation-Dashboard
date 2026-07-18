'use client';

import React from 'react';
import { Appointment } from '@/lib/types';
import { AppointmentChip } from './AppointmentChip';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import clsx from 'clsx';

interface CalendarGridProps {
  appointments: Appointment[];
  currentDate: Date;
  viewMode: 'week' | 'month';
  onSelectAppointment: (app: Appointment) => void;
}

export function CalendarGrid({ appointments, currentDate, viewMode, onSelectAppointment }: CalendarGridProps) {
  
  // Calculate days to display based on view mode
  const days = React.useMemo(() => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const start = startOfWeek(monthStart, { weekStartsOn: 1 });
      const end = endOfWeek(monthEnd, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    }
  }, [currentDate, viewMode]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header Row */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map(day => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={clsx(
        "grid grid-cols-7",
        viewMode === 'month' && "auto-rows-[120px]",
        viewMode === 'week' && "auto-rows-[minmax(200px,auto)]"
      )}>
        {days.map((day, idx) => {
          const dayAppointments = appointments.filter(a => a.date === format(day, 'yyyy-MM-dd'));
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div 
              key={day.toString()} 
              className={clsx(
                "border-b border-r border-gray-100 p-2 flex flex-col transition-colors hover:bg-gray-50",
                !isCurrentMonth && viewMode === 'month' && "bg-gray-50/50 text-gray-400",
                (idx + 1) % 7 === 0 && "border-r-0"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={clsx(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                  isCurrentDay 
                    ? "bg-primary-600 text-white shadow-sm" 
                    : "text-gray-700"
                )}>
                  {format(day, 'd')}
                </span>
                
                {dayAppointments.length > 0 && viewMode === 'month' && (
                  <span className="text-xs text-gray-400 font-medium md:hidden">
                    {dayAppointments.length}
                  </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {dayAppointments.map(app => (
                  <AppointmentChip 
                    key={app.id} 
                    appointment={app} 
                    onClick={onSelectAppointment} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
