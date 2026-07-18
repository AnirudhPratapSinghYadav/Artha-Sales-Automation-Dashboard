'use client';

import React from 'react';
import { Appointment } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { format, parseISO } from 'date-fns';
import { Video, Calendar as CalendarIcon, User, Phone, AlignLeft } from 'lucide-react';
import Link from 'next/link';

interface AppointmentDetailProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export function AppointmentDetail({ appointment, onClose }: AppointmentDetailProps) {
  if (!appointment) return null;

  const dateStr = format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy');
  const timeStr = appointment.time || format(parseISO(appointment.date), 'h:mm a');

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'qc_confirmed': return 'QC Confirmed';
      case 'ai_booked': return 'AI Booked';
      case 'meeting_scheduled': return 'Meeting Scheduled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qc_confirmed': return 'active'; // green
      case 'ai_booked': return 'exploring'; // blue/purpleish
      case 'meeting_scheduled': return 'engaged'; // amber
      default: return 'dormant';
    }
  };

  return (
    <Modal isOpen={!!appointment} onClose={onClose} title="Appointment Details" size="md">
      <div className="space-y-6">
        
        {/* Header section */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              {appointment.lead_name}
            </h3>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4" />
              +{appointment.phone}
            </p>
          </div>
          <Badge variant={getStatusColor(appointment.status) as any}>
            {getStatusLabel(appointment.status)}
          </Badge>
        </div>

        {/* Date/Time & Link */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <CalendarIcon className="w-5 h-5 text-primary-500" />
            <div>
              <p className="font-medium text-gray-900">{dateStr}</p>
              <p className="text-sm">{timeStr}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700 pt-3 border-t border-gray-200">
            <Video className="w-5 h-5 text-primary-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-0.5">Meeting Link</p>
              <a 
                href={appointment.meeting_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 truncate block"
              >
                {appointment.meeting_link}
              </a>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
            <AlignLeft className="w-4 h-4 text-gray-500" />
            Conversation Summary
          </h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
            {appointment.conversation_summary}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Close
          </button>
          <Link 
            href={`/whatsapp`}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            View Chat
          </Link>
        </div>

      </div>
    </Modal>
  );
}
