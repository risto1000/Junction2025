import { X, MapPin, Navigation } from 'lucide-react';
import type { Event } from '../App';

interface MapViewProps {
  events: Event[];
  onClose: () => void;
  onEventSelect: (event: Event) => void;
}

export function MapView({ events, onClose, onEventSelect }: MapViewProps) {
  return (
    <div className="fixed inset-0 bg-[#FCFBF9] z-50">
      {/* Header */}
      <div className="absolute top-[59px] left-0 right-0 max-w-[430px] mx-auto z-10">
        <div className="bg-white/95 backdrop-blur-md border-b border-[#E8E6E3] px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0B1A1A]">Event Map</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-[#5D6A6A] active:scale-95 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-[#5D6A6A] mt-1">{events.length} events nearby</p>
        </div>
      </div>

      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8F4F3] to-[#F5F3EF]">
        {/* Simulated Map Grid */}
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0A8F86" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Event Pins */}
        {events.map((event, index) => {
          // Simulate different positions
          const positions = [
            { top: '25%', left: '30%' },
            { top: '40%', left: '60%' },
            { top: '55%', left: '40%' },
            { top: '35%', left: '75%' },
            { top: '65%', left: '25%' },
          ];
          const position = positions[index % positions.length];

          return (
            <button
              key={event.id}
              onClick={() => onEventSelect(event)}
              className="absolute transform -translate-x-1/2 -translate-y-full active:scale-110 transition-transform"
              style={{ top: position.top, left: position.left }}
            >
              {/* Pin */}
              <div className="relative">
                <div className="w-12 h-12 bg-[#0A8F86] rounded-full shadow-lg flex items-center justify-center border-4 border-white mb-1">
                  <MapPin className="w-6 h-6 text-white fill-white" />
                </div>
                {/* Pin Pointer */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
              </div>
            </button>
          );
        })}

        {/* User Location Indicator */}
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-16 h-16 bg-[#0A8F86]/20 rounded-full animate-ping absolute" />
            <div className="w-16 h-16 bg-[#0A8F86]/30 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-[#0A8F86] rounded-full border-4 border-white shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Event Cards Carousel at Bottom */}
      <div className="absolute bottom-[34px] left-0 right-0 max-w-[430px] mx-auto px-4 pb-4">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => onEventSelect(event)}
              className="flex-shrink-0 w-[280px] bg-white rounded-2xl p-4 shadow-lg snap-center active:scale-95 transition-transform"
            >
              <div className="flex gap-3">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-[#0B1A1A] text-[15px] mb-1 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center gap-1 text-[#5D6A6A] text-[13px] mb-2">
                    <Navigation className="w-3 h-3" />
                    <span>{event.distance}</span>
                  </div>
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
                      <span className="text-[#5D6A6A] text-[13px] ml-1">
                        +{event.capacity - event.spacesLeft}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
