import { ArrowLeft, Heart, Share2, MapPin, Clock, Users, AlertCircle, Calendar, MessageCircle, Mic } from 'lucide-react';
import type { Event } from '../App';
import { useState } from 'react';

interface EventDetailScreenProps {
  event: Event;
  isFavorite: boolean;
  hasRSVP: boolean;
  onToggleFavorite: () => void;
  onRSVP: () => void;
  onBack: () => void;
  onHostDashboard: () => void;
}

export function EventDetailScreen({ 
  event, 
  isFavorite, 
  hasRSVP, 
  onToggleFavorite, 
  onRSVP, 
  onBack,
  onHostDashboard 
}: EventDetailScreenProps) {
  const isHost = event.organizer === 'Jari Koskinen';
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* Fixed Header Actions */}
      <div className="fixed top-[59px] left-0 right-0 max-w-[430px] mx-auto px-4 flex items-center justify-between z-50">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-sm"
        >
          <ArrowLeft className="w-6 h-6 text-[#0B1A1A]" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-sm"
          >
            <Heart 
              className={`w-5 h-5 ${
                isFavorite 
                  ? 'fill-[#FF7A6C] text-[#FF7A6C]' 
                  : 'text-[#0B1A1A]'
              }`}
            />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <Share2 className="w-5 h-5 text-[#0B1A1A]" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-80">
        <img 
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {event.matchScore && (
            <div className="px-3 py-1 bg-[#0A8F86] text-white rounded-full text-sm">
              {event.matchScore}% match
            </div>
          )}
          {event.isMicroApprenticeship && (
            <div className="px-3 py-1 bg-[#FF7A6C] text-white rounded-full text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
              Micro-Apprenticeship
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 pb-32">
        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-4">
          <h1 className="text-[#0B1A1A] mb-2">{event.title}</h1>
          <p className="text-[#5D6A6A] mb-6">{event.description}</p>

          {/* Date & Time */}
          <div className="flex items-start gap-3 mb-4 p-4 bg-[#F5F3EF] rounded-2xl">
            <Clock className="w-5 h-5 text-[#0A8F86] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#0B1A1A]">{event.date}</p>
              <p className="text-[#5D6A6A]">{event.time}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 mb-4 p-4 bg-[#F5F3EF] rounded-2xl">
            <MapPin className="w-5 h-5 text-[#0A8F86] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-[#0B1A1A] mb-2">{event.location}</p>
              <p className="text-[#5D6A6A] text-sm mb-3">{event.distance}</p>
              
              {/* Map Thumbnail */}
              <div className="relative h-32 rounded-xl overflow-hidden bg-[#E8E6E3]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#0A8F86]" />
                </div>
                <button className="absolute inset-0 active:bg-black/5" />
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div 
            onClick={() => event.participantDetails.length > 0 && setShowAttendeesModal(true)}
            className={`flex items-center gap-3 p-4 bg-[#F5F3EF] rounded-2xl mb-4 ${event.participantDetails.length > 0 ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
          >
            <Users className="w-5 h-5 text-[#0A8F86] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[#0B1A1A]">Capacity: {event.capacity} people</p>
              <p className="text-[#5D6A6A]">{event.spacesLeft} spots remaining</p>
            </div>
            <div className="flex -space-x-2">
              {event.participants.slice(0, 5).map((avatar, idx) => (
                <img 
                  key={idx}
                  src={avatar}
                  alt="Participant"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
              ))}
              {event.participants.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-[#0A8F86] border-2 border-white flex items-center justify-center text-white text-xs">
                  +{event.participants.length - 5}
                </div>
              )}
            </div>
          </div>

          {/* Accessibility */}
          <div className="flex items-start gap-3 p-4 bg-[#0A8F86]/5 rounded-2xl mb-4">
            <AlertCircle className="w-5 h-5 text-[#0A8F86] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[#0B1A1A] mb-1">Accessibility Notes</p>
              <p className="text-[#5D6A6A]">{event.accessibilityNotes}</p>
              <p className="text-[#5D6A6A] mt-2">Age: {event.ageSuitability}</p>
            </div>
          </div>
        </div>

        {/* Organizer Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <h3 className="text-[#0B1A1A] mb-4">Hosted by</h3>
          <div className="flex items-start gap-4">
            <img 
              src={event.organizerAvatar}
              alt={event.organizer}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[#0B1A1A]">{event.organizer}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.organizerBadge === 'Senior-host' 
                    ? 'bg-[#0A8F86]/10 text-[#0A8F86]'
                    : event.organizerBadge === 'Youth-host'
                    ? 'bg-[#FF7A6C]/10 text-[#FF7A6C]'
                    : 'bg-[#5D6A6A]/10 text-[#5D6A6A]'
                }`}>
                  {event.organizerBadge}
                </span>
              </div>
              <p className="text-[#5D6A6A] mb-3">{event.organizerBio}</p>
              {!isHost && (
                <button className="h-10 px-4 bg-[#F5F3EF] text-[#0A8F86] rounded-xl flex items-center gap-2 active:scale-95 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message organizer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Host Dashboard Access */}
        {isHost && (
          <button
            onClick={onHostDashboard}
            className="w-full bg-[#0A8F86]/10 border-2 border-[#0A8F86] text-[#0A8F86] rounded-2xl p-4 mb-4 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-medium">You're hosting this event</p>
                  <p className="text-sm opacity-75">View attendee list & manage</p>
                </div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-[#E8E6E3] p-4 pb-[34px]">
        {hasRSVP ? (
          <div className="flex gap-3">
            <button className="flex-1 h-14 bg-[#0A8F86]/10 text-[#0A8F86] rounded-2xl flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Added to calendar</span>
            </button>
            <button className="flex-1 h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              <Mic className="w-5 h-5" />
              <span>Record reflection</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onRSVP}
            className="w-full h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
          >
            <Calendar className="w-5 h-5" />
            <span>RSVP — I'll come</span>
          </button>
        )}
      </div>

      {/* Attendees Modal */}
      {showAttendeesModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end"
          onClick={() => setShowAttendeesModal(false)}
        >
          <div 
            className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6 pb-[50px] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#0B1A1A]">Who's Coming</h2>
              <button
                onClick={() => setShowAttendeesModal(false)}
                className="w-8 h-8 flex items-center justify-center text-[#5D6A6A] active:scale-90 transition-transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* First 2 participants */}
              {event.participantDetails.slice(0, 2).map((participant) => (
                <div key={participant.id} className="flex items-center gap-4 p-4 bg-[#F5F3EF] rounded-2xl">
                  <img 
                    src={participant.avatar}
                    alt={`${participant.firstName} ${participant.lastName}`}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[#0B1A1A]">{participant.firstName} {participant.lastName}</p>
                    <p className="text-[#5D6A6A] text-sm">Attending</p>
                  </div>
                </div>
              ))}

              {/* Remaining participants */}
              {event.participantDetails.length > 2 && (
                <div className="flex items-center gap-4 p-4 bg-[#0A8F86]/5 rounded-2xl">
                  <div className="w-14 h-14 rounded-full bg-[#0A8F86] flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0B1A1A]">+{event.participantDetails.length - 2} other people</p>
                    <p className="text-[#5D6A6A] text-sm">Also attending</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}