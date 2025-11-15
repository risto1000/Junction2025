import { useState } from 'react';
import { X, Upload, Calendar, Clock, MapPin, Users, Info } from 'lucide-react';

interface HostEventModalProps {
  onClose: () => void;
  onPublish: (eventData: any) => void;
}

export function HostEventModal({ onClose, onPublish }: HostEventModalProps) {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    hosts: '',
    date: '',
    time: '',
    location: '',
    difficulty: 'Beginner',
    capacity: '10',
  });

  const handlePublish = () => {
    onPublish(eventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl pb-[34px] max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E8E6E3] px-6 py-4 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[#0B1A1A]">Host an Event</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-[#5D6A6A] active:scale-95 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-[#5D6A6A] mt-1">Share your skills and bring people together</p>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-5">
          {/* Event Name */}
          <div className="space-y-2">
            <label className="text-[#0B1A1A] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#0A8F86]" />
              Event Name
            </label>
            <input
              type="text"
              placeholder="e.g., Morning Coffee & Woodworking"
              value={eventData.name}
              onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
              className="w-full h-14 px-4 bg-[#F5F3EF] rounded-2xl text-[#0B1A1A] outline-none border-2 border-transparent focus:border-[#0A8F86] transition-colors text-[17px]"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[#0B1A1A]">Description</label>
            <textarea
              placeholder="Tell people what they'll learn or do..."
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-[#F5F3EF] rounded-2xl text-[#0B1A1A] outline-none border-2 border-transparent focus:border-[#0A8F86] transition-colors resize-none text-[17px]"
            />
          </div>

          {/* Hosts */}
          <div className="space-y-2">
            <label className="text-[#0B1A1A] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0A8F86]" />
              Host(s)
            </label>
            <input
              type="text"
              placeholder="Your name or co-hosts"
              value={eventData.hosts}
              onChange={(e) => setEventData({ ...eventData, hosts: e.target.value })}
              className="w-full h-14 px-4 bg-[#F5F3EF] rounded-2xl text-[#0B1A1A] outline-none border-2 border-transparent focus:border-[#0A8F86] transition-colors text-[17px]"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[#0B1A1A] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0A8F86]" />
                Date
              </label>
              <input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                className="w-full h-14 px-4 bg-[#F5F3EF] rounded-2xl text-[#0B1A1A] outline-none border-2 border-transparent focus:border-[#0A8F86] transition-colors text-[17px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[#0B1A1A] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0A8F86]" />
                Time
              </label>
              <input
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                className="w-full h-14 px-4 bg-[#F5F3EF] rounded-2xl text-[#0B1A1A] outline-none border-2 border-transparent focus:border-[#0A8F86] transition-colors text-[17px]"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-[#0B1A1A] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0A8F86]" />
              Location
            </label>
            <input
              type="text"
              placeholder="Where will this happen?"
              value={eventData.location}
              onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
              className="w-full h-14 px-4 bg-[#F5F3EF] rounded-2xl text-[#0B1A1A] outline-none border-2 border-transparent focus:border-[#0A8F86] transition-colors text-[17px]"
            />
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <label className="text-[#0B1A1A]">Difficulty Level</label>
            <div className="flex gap-2">
              {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                <button
                  key={level}
                  onClick={() => setEventData({ ...eventData, difficulty: level })}
                  className={`flex-1 h-12 rounded-xl transition-all text-[17px] ${
                    eventData.difficulty === level
                      ? 'bg-[#0A8F86] text-white'
                      : 'bg-[#F5F3EF] text-[#5D6A6A]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="text-[#0B1A1A]">Maximum Attendees</label>
            <input
              type="number"
              placeholder="10"
              value={eventData.capacity}
              onChange={(e) => setEventData({ ...eventData, capacity: e.target.value })}
              className="w-full h-14 px-4 bg-[#F5F3EF] rounded-2xl text-[#0B1A1A] outline-none border-2 border-transparent focus:border-[#0A8F86] transition-colors text-[17px]"
            />
          </div>

          {/* Add Photo */}
          <div className="space-y-2">
            <label className="text-[#0B1A1A]">Event Photo</label>
            <button className="w-full h-32 bg-[#F5F3EF] rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#0A8F86]/30 active:bg-[#E8E6E3] transition-colors">
              <Upload className="w-8 h-8 text-[#0A8F86]" />
              <span className="text-[#5D6A6A] text-[17px]">Upload photo</span>
            </button>
          </div>
        </div>

        {/* Publish Button */}
        <div className="sticky bottom-0 bg-white border-t border-[#E8E6E3] px-6 py-4">
          <button
            onClick={handlePublish}
            className="w-full h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg text-[17px]"
          >
            <Calendar className="w-5 h-5" />
            <span>Publish Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}
