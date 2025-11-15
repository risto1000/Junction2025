import { useState } from 'react';
import { X, Calendar, Users } from 'lucide-react';
import type { Event } from '../App';

interface RSVPModalProps {
  event: Event;
  onConfirm: (inviteFamily: boolean) => void;
  onClose: () => void;
}

export function RSVPModal({ event, onConfirm, onClose }: RSVPModalProps) {
  const [inviteFamily, setInviteFamily] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl animate-slide-up pb-[34px]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8E6E3]">
          <h2 className="text-[#0B1A1A]">Confirm RSVP</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-[#5D6A6A]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Summary */}
          <div className="flex gap-4 mb-6 p-4 bg-[#F5F3EF] rounded-2xl">
            <img 
              src={event.image}
              alt={event.title}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="text-[#0B1A1A] mb-1">{event.title}</h3>
              <p className="text-[#5D6A6A] text-sm mb-1">{event.date}</p>
              <p className="text-[#5D6A6A] text-sm">{event.time}</p>
            </div>
          </div>

          {/* Invite Family Option */}
          <div 
            onClick={() => setInviteFamily(!inviteFamily)}
            className="flex items-start gap-3 p-4 bg-[#F5F3EF] rounded-2xl mb-6 active:bg-[#E8E6E3] transition-colors cursor-pointer"
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
              inviteFamily ? 'bg-[#0A8F86] border-[#0A8F86]' : 'border-[#5D6A6A]'
            }`}>
              {inviteFamily && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[#0B1A1A] mb-1">Invite family to join</p>
              <p className="text-[#5D6A6A] text-sm">Send event details to your family circle</p>
            </div>
            <Users className="w-5 h-5 text-[#0A8F86] flex-shrink-0 mt-1" />
          </div>

          {/* What happens next */}
          <div className="p-4 bg-[#0A8F86]/5 rounded-2xl mb-6">
            <p className="text-[#0B1A1A] mb-2">What happens next:</p>
            <ul className="space-y-2 text-[#5D6A6A] text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#0A8F86] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>We'll send you a reminder 1 hour before</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#0A8F86] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Event added to your calendar</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#0A8F86] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Family can see your check-in (if enabled)</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-14 bg-white border-2 border-[#E8E6E3] text-[#5D6A6A] rounded-2xl active:scale-[0.98] transition-transform"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(inviteFamily)}
              className="flex-1 h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Calendar className="w-5 h-5" />
              <span>Confirm RSVP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
