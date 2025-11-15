import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Heart, MapPin, Users, Mic, Map, Plus } from 'lucide-react';
import type { Event } from '../App';
import { MapView } from './MapView';
import { HostEventModal } from './HostEventModal';

// Declare custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id'?: string;
      };
    }
  }
}

interface EventsScreenProps {
  events: Event[];
  favorites: string[];
  onToggleFavorite: (eventId: string) => void;
  onEventSelect: (event: Event) => void;
}

export function EventsScreen({ events, favorites, onToggleFavorite, onEventSelect }: EventsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showHostEventModal, setShowHostEventModal] = useState(false);

  // Load ElevenLabs widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount if needed
      const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const featuredEvents = events.slice(0, 2);
  const regularEvents = events.slice(2);

  const handlePublishEvent = (eventData: any) => {
    console.log('Publishing event:', eventData);
    // Handle event creation
  };

  if (showMapView) {
    return (
      <MapView 
        events={events}
        onClose={() => setShowMapView(false)}
        onEventSelect={(event) => {
          setShowMapView(false);
          onEventSelect(event);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] relative">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 bg-gradient-to-b from-[#0A8F86]/5 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[#0B1A1A]">Discover Events</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowHostEventModal(true)}
              className="h-10 px-4 bg-[#0A8F86] text-white rounded-full flex items-center gap-2 active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[15px] font-medium">Host Event</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-[#0A8F86]">
              <Mic className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 h-12 bg-white rounded-2xl flex items-center px-4 gap-3 shadow-sm">
            <Search className="w-5 h-5 text-[#5D6A6A]" />
            <input
              type="text"
              placeholder="Search events, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#0B1A1A] placeholder:text-[#5D6A6A]"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-12 h-12 bg-[#0A8F86] rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-2xl shadow-sm space-y-3">
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-[#0A8F86] text-white rounded-full">All</button>
              <button className="px-4 py-2 bg-[#F5F3EF] text-[#5D6A6A] rounded-full">Walks</button>
              <button className="px-4 py-2 bg-[#F5F3EF] text-[#5D6A6A] rounded-full">Workshops</button>
              <button className="px-4 py-2 bg-[#F5F3EF] text-[#5D6A6A] rounded-full">Mentorship</button>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E6E3]">
              <span className="text-[#5D6A6A]">Intergenerational friendly</span>
              <div className="w-12 h-7 rounded-full bg-[#0A8F86] relative">
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Featured Carousel */}
      <div className="px-4 mb-6">
        <h2 className="text-[#0B1A1A] mb-4">Featured Events</h2>
        <div className="space-y-3">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="w-full bg-white rounded-3xl overflow-hidden shadow-md"
            >
              <div 
                onClick={() => onEventSelect(event)}
                className="w-full cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="relative h-48 p-3">
                  <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  {event.matchScore && (
                    <div className="absolute top-6 left-6 px-3 py-1 bg-[#0A8F86] text-white rounded-full text-sm">
                      {event.matchScore}% match
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(event.id);
                    }}
                    className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.includes(event.id) 
                          ? 'fill-[#FF7A6C] text-[#FF7A6C]' 
                          : 'text-[#5D6A6A]'
                      }`}
                    />
                  </button>
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-[#0B1A1A] mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-[#5D6A6A] mb-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.distance}
                    </span>
                  </div>
                  <p className="text-[#5D6A6A] mb-3">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
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
                    {event.isMicroApprenticeship && (
                      <div className="px-3 py-1 bg-[#FF7A6C]/10 text-[#FF7A6C] rounded-full text-sm">
                        Mentorship
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Feed */}
      <div className="px-4 pb-8">
        <h2 className="text-[#0B1A1A] mb-4">Nearby Events</h2>
        <div className="space-y-3">
          {regularEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventSelect(event)}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-sm flex cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="relative w-28 h-28 flex-shrink-0 p-3">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                {event.matchScore && (
                  <div className="absolute bottom-5 left-5 px-2 py-0.5 bg-[#0A8F86] text-white rounded-full text-xs">
                    {event.matchScore}%
                  </div>
                )}
              </div>
              <div className="flex-1 p-3 text-left">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[#0B1A1A] flex-1 pr-2">{event.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(event.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.includes(event.id) 
                          ? 'fill-[#FF7A6C] text-[#FF7A6C]' 
                          : 'text-[#5D6A6A]'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-[#5D6A6A] text-sm mb-2">
                  <span>{event.time}</span>
                  <span>•</span>
                  <span>{event.distance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {event.participants.slice(0, 3).map((avatar, idx) => (
                        <img 
                          key={idx}
                          src={avatar}
                          alt="Participant"
                          className="w-6 h-6 rounded-full object-cover border-2 border-white"
                        />
                      ))}
                    </div>
                    {event.participants.length > 0 && (
                      <span className="text-[#5D6A6A] text-sm ml-1">
                        +{event.capacity - event.spacesLeft}
                      </span>
                    )}
                  </div>
                  <div className="px-3 py-1 bg-[#0A8F86]/10 text-[#0A8F86] rounded-full text-sm">
                    {event.spacesLeft} spots left
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ElevenLabs Voice Widget */}
      <elevenlabs-convai agent-id="agent_5901ka39kp8vf3j88v13q8a2n0k5"></elevenlabs-convai>
      
      {/* Floating Map Button */}
      <button 
        onClick={() => setShowMapView(true)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-[#0A8F86] rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
      >
        <Map className="w-6 h-6 text-white" />
      </button>

      {/* Host Event Modal */}
      {showHostEventModal && (
        <HostEventModal 
          onClose={() => setShowHostEventModal(false)}
          onPublish={handlePublishEvent}
        />
      )}
    </div>
  );
}