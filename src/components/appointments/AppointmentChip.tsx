'use client';

import React from 'react';
import { Appointment } from '@/lib/types';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';

interface AppointmentChipProps {
  appointment: Appointment;
  onClick: (app: Appointment) => void;
}

export function AppointmentChip({ appointment, onClick }: AppointmentChipProps) {
  const getColors = (status: string) => {
    switch (status) {
      case 'qc_confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'ai_booked': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'meeting_scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const time = appointment.time || format(parseISO(appointment.date), 'h:mm a');

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onClick(appointment);
      }}
      className={clsx(
        "rounded-md px-1.5 py-1 text-xs font-medium border mb-1 cursor-pointer hover:opacity-80 truncate transition-opacity shadow-sm",
        getColors(appointment.status)
      )}
      title={`${time} - ${appointment.lead_name}`}
    >
      <span className="font-semibold mr-1">{time}</span>
      {appointment.lead_name}
    </div>
  );
}
