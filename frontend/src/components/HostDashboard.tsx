import { ArrowLeft, Users, MessageCircle, CheckCircle, MapPin, Calendar, Send } from 'lucide-react';
import type { Event } from '../App';

interface HostDashboardProps {
  event: Event;
  onBack: () => void;
}

export function HostDashboard({ event, onBack }: HostDashboardProps) {
  const attendees = [
    { 
      id: '1', 
      name: 'Mirka Lahti', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      status: 'confirmed',
      checkedIn: false
    },
    { 
      id: '2', 
      name: 'Anna Virtanen', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      status: 'confirmed',
      checkedIn: false
    },
    { 
      id: '3', 
      name: 'Mikko Nieminen', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      status: 'confirmed',
      checkedIn: true
    },
    { 
      id: '4', 
      name: 'Sofia Mäkelä', 
      avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
      status: 'maybe',
      checkedIn: false
    },
  ];

  const confirmedCount = attendees.filter(a => a.status === 'confirmed').length;
  const checkedInCount = attendees.filter(a => a.checkedIn).length;

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0A8F86] to-[#0D6B64] text-white px-4 pt-[59px] pb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 mb-6 active:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="mb-2">Host Dashboard</h1>
        <p className="text-white/80">{event.title}</p>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-6 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-[#0A8F86]/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0A8F86]" />
              </div>
              <p className="text-[#0B1A1A] text-2xl mb-1">{confirmedCount}</p>
              <p className="text-[#5D6A6A] text-sm">Confirmed</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-[#FF7A6C]/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#FF7A6C]" />
              </div>
              <p className="text-[#0B1A1A] text-2xl mb-1">{checkedInCount}</p>
              <p className="text-[#5D6A6A] text-sm">Checked In</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 bg-[#5D6A6A]/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#5D6A6A]" />
              </div>
              <p className="text-[#0B1A1A] text-2xl mb-1">{event.spacesLeft}</p>
              <p className="text-[#5D6A6A] text-sm">Spots Left</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Info */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-[#0B1A1A] mb-4">Event Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[#5D6A6A]">
              <Calendar className="w-5 h-5 text-[#0A8F86]" />
              <span>{event.date} at {event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-[#5D6A6A]">
              <MapPin className="w-5 h-5 text-[#0A8F86]" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-[#5D6A6A]">
              <Users className="w-5 h-5 text-[#0A8F86]" />
              <span>{event.capacity} capacity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <button className="h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <MessageCircle className="w-5 h-5" />
            <span>Message all</span>
          </button>
          <button className="h-14 bg-white border-2 border-[#0A8F86] text-[#0A8F86] rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <Send className="w-5 h-5" />
            <span>Send update</span>
          </button>
        </div>
      </div>

      {/* Attendee List */}
      <div className="px-4 pb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0B1A1A]">Attendees ({attendees.length})</h3>
            <button className="text-[#0A8F86] flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </button>
          </div>

          <div className="space-y-3">
            {attendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center gap-3 p-3 bg-[#F5F3EF] rounded-2xl">
                <img 
                  src={attendee.avatar}
                  alt={attendee.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-[#0B1A1A]">{attendee.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      attendee.status === 'confirmed'
                        ? 'bg-[#0A8F86]/10 text-[#0A8F86]'
                        : 'bg-[#5D6A6A]/10 text-[#5D6A6A]'
                    }`}>
                      {attendee.status === 'confirmed' ? 'Confirmed' : 'Maybe'}
                    </span>
                    {attendee.checkedIn && (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#FF7A6C]/10 text-[#FF7A6C] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Checked in
                      </span>
                    )}
                  </div>
                </div>
                <button className="w-10 h-10 flex items-center justify-center text-[#0A8F86]">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Check-in Toggle (Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-[#E8E6E3] p-4 pb-[34px]">
        <button className="w-full h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg">
          <CheckCircle className="w-5 h-5" />
          <span>Enable check-in mode</span>
        </button>
        <p className="text-center text-[#5D6A6A] text-sm mt-2">
          Let attendees check in when they arrive
        </p>
      </div>
    </div>
  );
}
