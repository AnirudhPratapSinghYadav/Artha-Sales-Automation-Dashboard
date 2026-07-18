'use client';

import React, { useState, useEffect } from 'react';
import { Appointment } from '@/lib/types';
import { getAppointments } from '@/lib/data';
import { CalendarGrid } from '@/components/appointments/CalendarGrid';
import { AppointmentDetail } from '@/components/appointments/AppointmentDetail';
import { format, addMonths, subMonths, addWeeks, subWeeks, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '@/components/ui/ToastProvider';
import { BookMeetingModal } from '@/components/appointments/BookMeetingModal';

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // In a real app, we'd pass start/end dates to getAppointments based on view
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        toast({ title: 'Error', message: 'Failed to load appointments', variant: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentDate, viewMode, toast]);

  const nextPeriod = () => {
    setCurrentDate(prev => viewMode === 'month' ? addMonths(prev, 1) : addWeeks(prev, 1));
  };

  const prevPeriod = () => {
    setCurrentDate(prev => viewMode === 'month' ? subMonths(prev, 1) : subWeeks(prev, 1));
  };

  const getHeaderTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      if (format(start, 'MMM') === format(end, 'MMM')) {
        return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
      }
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">Appointments</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500 dark:text-zinc-400">Manage scheduled meetings and AI bookings</p>
            </div>
          </div>
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="w-4 h-4" />
            Book Meeting
          </button>
        </div>

        {/* Color Legend */}
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span className="text-gray-700 dark:text-zinc-300">QC Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span className="text-gray-700 dark:text-zinc-300">AI Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-gray-700 dark:text-zinc-300">Meeting Scheduled</span>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 rounded-t-xl border-b-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            aria-label="Go to today"
          >
            Today
          </button>
          
          <div className="flex items-center gap-1">
            <button onClick={prevPeriod} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500" aria-label="Previous period">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 min-w-[150px] text-center">
              {getHeaderTitle()}
            </h3>
            <button onClick={nextPeriod} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500" aria-label="Next period">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center bg-gray-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-gray-200 dark:border-zinc-800" role="group" aria-label="Calendar View">
          <button
            onClick={() => setViewMode('week')}
            className={clsx(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500",
              viewMode === 'week' ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
            )}
            aria-pressed={viewMode === 'week'}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={clsx(
              "px-4 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500",
              viewMode === 'month' ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm" : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
            )}
            aria-pressed={viewMode === 'month'}
          >
            Month
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-b-xl shadow-sm p-4 animate-pulse">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-12 mx-auto" />
            ))}
          </div>
          <div className={clsx("grid grid-cols-7 gap-2", viewMode === 'month' ? "grid-rows-5" : "grid-rows-1")}>
            {[...Array(viewMode === 'month' ? 35 : 7)].map((_, i) => (
              <div key={i} className="h-28 border border-gray-100 dark:border-zinc-800 rounded-lg p-2 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-6" />
                {i % 4 === 0 && <div className="h-5 bg-purple-100/50 dark:bg-purple-950/30 rounded-md w-full" />}
                {i % 6 === 0 && <div className="h-5 bg-blue-100/50 dark:bg-blue-950/30 rounded-md w-full" />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <CalendarGrid 
          appointments={appointments} 
          currentDate={currentDate} 
          viewMode={viewMode}
          onSelectAppointment={setSelectedAppointment}
        />
      )}

      <AppointmentDetail 
        appointment={selectedAppointment} 
        onClose={() => setSelectedAppointment(null)} 
      />

      <BookMeetingModal 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
      />
    </div>
  );
}
