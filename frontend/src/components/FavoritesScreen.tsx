import { Heart, Share2, Calendar, MapPin } from 'lucide-react';
import type { Event } from '../App';

interface FavoritesScreenProps {
  events: Event[];
  onToggleFavorite: (eventId: string) => void;
  onEventSelect: (event: Event) => void;
}

export function FavoritesScreen({ events, onToggleFavorite, onEventSelect }: FavoritesScreenProps) {
  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 bg-gradient-to-b from-[#FF7A6C]/5 to-transparent">
        <h1 className="text-[#0B1A1A] mb-6">Saved Events</h1>

        {/* Suggestions Banner */}
        <div className="bg-gradient-to-br from-[#0A8F86] to-[#0D6B64] text-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h3>Suggested for You</h3>
          </div>
          <p className="text-white/80 mb-4">Based on your saved events, we think you might enjoy these</p>
          <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white flex items-center gap-2">
            <span>View 3 suggestions</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Saved Events */}
      <div className="px-4 pb-8">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#F5F3EF] rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-[#5D6A6A]" />
            </div>
            <h2 className="text-[#0B1A1A] mb-2">No saved events yet</h2>
            <p className="text-[#5D6A6A] mb-6">Tap the heart icon on events you're interested in</p>
            <button className="px-6 py-3 bg-[#0A8F86] text-white rounded-2xl">
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-[#0B1A1A]">Your Favorites ({events.length})</h2>
            
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-sm">
                <div className="w-full">
                  {/* Event Image */}
                  <button
                    onClick={() => onEventSelect(event)}
                    className="w-full active:bg-[#FCFBF9] transition-colors"
                  >
                    <div className="relative h-48">
                      <img 
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.matchScore && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-[#0A8F86] text-white rounded-full text-sm">
                          {event.matchScore}% match
                        </div>
                      )}
                      {event.isMicroApprenticeship && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-[#FF7A6C] text-white rounded-full text-sm">
                          Mentorship
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="p-4 text-left">
                      <h3 className="text-[#0B1A1A] mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-[#5D6A6A] mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#5D6A6A] mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>

                      {/* Organizer */}
                      <div className="flex items-center gap-2 mb-4">
                        <img 
                          src={event.organizerAvatar}
                          alt={event.organizer}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[#0B1A1A] text-sm">{event.organizer}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            event.organizerBadge === 'Senior-host' 
                              ? 'bg-[#0A8F86]/10 text-[#0A8F86]'
                              : event.organizerBadge === 'Youth-host'
                              ? 'bg-[#FF7A6C]/10 text-[#FF7A6C]'
                              : 'bg-[#5D6A6A]/10 text-[#5D6A6A]'
                          }`}>
                            {event.organizerBadge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(event.id);
                      }}
                      className="flex-1 h-11 bg-[#FF7A6C]/10 text-[#FF7A6C] rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      <span>Remove</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle share to family
                      }}
                      className="flex-1 h-11 bg-[#F5F3EF] text-[#0A8F86] rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share to family</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}