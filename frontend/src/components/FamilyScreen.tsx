import { useState } from 'react';
import { Plus, Send, Mic, Paperclip, MoreVertical, CheckCircle, Calendar, MapPin } from 'lucide-react';
import type { Event } from '../App';

interface FamilyScreenProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'voice' | 'event' | 'checkin';
  eventData?: Event;
  duration?: string;
}

export function FamilyScreen({ events, onEventSelect }: FamilyScreenProps) {
  const [showChat, setShowChat] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showShareEventModal, setShowShareEventModal] = useState(false);

  const familyMembers = [
    { id: '1', name: 'Jari Koskinen', avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop', relation: 'You' },
    { id: '2', name: 'Anna Koskinen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', relation: 'Daughter' },
    { id: '3', name: 'Mikko Koskinen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', relation: 'Son' },
  ];

  const activityTimeline = [
    { 
      id: '1', 
      type: 'attended', 
      member: 'Jari Koskinen', 
      event: 'Morning Duck Walk', 
      time: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop'
    },
    { 
      id: '2', 
      type: 'hosted', 
      member: 'Jari Koskinen', 
      event: 'Chair Repair Workshop', 
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop'
    },
    { 
      id: '3', 
      type: 'safety', 
      member: 'Jari Koskinen', 
      event: 'Checked in at Kaivopuisto Park', 
      time: '2 days ago',
      avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop'
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'Anna Koskinen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: 'Isä, how was the duck walk this morning?',
      timestamp: '2 hours ago',
      type: 'text'
    },
    {
      id: '2',
      sender: 'Jari Koskinen',
      avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop',
      content: 'It was wonderful! Met 8 people and the weather was perfect.',
      timestamp: '1 hour ago',
      type: 'voice',
      duration: '0:23'
    },
    {
      id: '3',
      sender: 'Jari Koskinen',
      avatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop',
      content: 'Attended Morning Duck Walk',
      timestamp: '2 hours ago',
      type: 'checkin'
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle send
      setMessageInput('');
    }
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-[#FCFBF9] flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-[#E8E6E3] px-4 pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setShowChat(false)} className="flex items-center gap-2 text-[#0A8F86]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-[#5D6A6A]">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-[#0B1A1A]">Koskinen Family</h2>
          <p className="text-[#5D6A6A]">{familyMembers.length} members</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((message) => {
            const isMe = message.sender === 'Jari Koskinen';
            
            if (message.type === 'checkin') {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="max-w-[80%] bg-[#0A8F86]/10 rounded-2xl p-3 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-[#0A8F86]" />
                      <span className="text-[#0A8F86]">{message.sender}</span>
                    </div>
                    <p className="text-[#5D6A6A] text-sm">{message.content}</p>
                    <p className="text-[#5D6A6A] text-xs mt-1">{message.timestamp}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && (
                  <img 
                    src={message.avatar}
                    alt={message.sender}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isMe && <p className="text-[#5D6A6A] text-xs mb-1">{message.sender}</p>}
                  <div className={`rounded-2xl p-4 ${
                    isMe 
                      ? 'bg-[#0A8F86] text-white rounded-br-sm' 
                      : 'bg-white text-[#0B1A1A] rounded-bl-sm'
                  }`}>
                    {message.type === 'voice' ? (
                      <div className="flex items-center gap-3">
                        <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </button>
                        <div className="flex-1">
                          <div className="flex gap-0.5 mb-1">
                            {Array(20).fill(0).map((_, i) => (
                              <div key={i} className="w-1 bg-white/50 rounded-full" style={{ height: `${8 + Math.random() * 16}px` }} />
                            ))}
                          </div>
                          <p className={`text-xs ${isMe ? 'text-white/70' : 'text-[#5D6A6A]'}`}>{message.duration}</p>
                        </div>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  <p className={`text-xs text-[#5D6A6A] mt-1`}>{message.timestamp}</p>
                </div>
              </div>
            );
          })}

          {/* Share Event Button */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={() => setShowShareEventModal(true)}
              className="px-4 py-2 bg-[#0A8F86]/10 text-[#0A8F86] rounded-full flex items-center gap-2 active:scale-95 transition-transform"
            >
              <Calendar className="w-4 h-4" />
              <span>Share an event</span>
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-[#E8E6E3] p-4 pb-[34px]">
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center text-[#5D6A6A]">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-[#F5F3EF] rounded-2xl px-4 h-12">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#0B1A1A]"
              />
              <button className="w-8 h-8 flex items-center justify-center text-[#0A8F86]">
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={handleSendMessage}
              className="w-10 h-10 bg-[#0A8F86] rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Share Event Modal */}
        {showShareEventModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
            <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-[34px] max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#0B1A1A]">Share Event</h3>
                <button onClick={() => setShowShareEventModal(false)} className="text-[#5D6A6A]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {events.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setShowShareEventModal(false);
                      // Simulate sharing
                    }}
                    className="w-full flex gap-3 p-3 bg-[#F5F3EF] rounded-2xl active:bg-[#E8E6E3] transition-colors"
                  >
                    <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 text-left">
                      <p className="text-[#0B1A1A]">{event.title}</p>
                      <p className="text-[#5D6A6A] text-sm">{event.date} · {event.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 bg-gradient-to-b from-[#0A8F86]/5 to-transparent">
        <h1 className="text-[#0B1A1A] mb-6">FamilySphere</h1>

        {/* Family Members */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0B1A1A]">Koskinen Family</h3>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="text-[#0A8F86] flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-3">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <img 
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-[#0B1A1A]">{member.name}</p>
                  <p className="text-[#5D6A6A] text-sm">{member.relation}</p>
                </div>
                {member.relation === 'You' && (
                  <span className="px-3 py-1 bg-[#0A8F86]/10 text-[#0A8F86] rounded-full text-sm">You</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="px-4 mb-6">
        <h2 className="text-[#0B1A1A] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {activityTimeline.map((activity) => (
            <div key={activity.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3">
              <img 
                src={activity.avatar}
                alt={activity.member}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  {activity.type === 'attended' && <CheckCircle className="w-5 h-5 text-[#0A8F86] flex-shrink-0 mt-0.5" />}
                  {activity.type === 'hosted' && <Calendar className="w-5 h-5 text-[#FF7A6C] flex-shrink-0 mt-0.5" />}
                  {activity.type === 'safety' && <MapPin className="w-5 h-5 text-[#5D6A6A] flex-shrink-0 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-[#0B1A1A]">
                      <span className="font-medium">{activity.member}</span>
                      {' '}
                      {activity.type === 'attended' && 'attended'}
                      {activity.type === 'hosted' && 'hosted'}
                      {activity.type === 'safety' && 'checked in at'}
                    </p>
                    <p className="text-[#5D6A6A]">{activity.event}</p>
                    <p className="text-[#5D6A6A] text-sm mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Preview */}
      <div className="px-4 pb-8">
        <button 
          onClick={() => setShowChat(true)}
          className="w-full bg-gradient-to-br from-[#0A8F86] to-[#0D6B64] text-white rounded-3xl p-6 shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-between mb-3">
            <h3>Family Chat</h3>
            <div className="w-6 h-6 bg-[#FF7A6C] rounded-full flex items-center justify-center text-xs">3</div>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <img 
              src={familyMembers[1].avatar}
              alt="Anna"
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="text-sm">Anna: Isä, how was the duck walk...</p>
          </div>
        </button>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0B1A1A]">Invite Family Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-[#5D6A6A]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-[#5D6A6A] mb-6">Send an invitation link via SMS or email</p>
            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full h-12 px-4 bg-[#F5F3EF] rounded-xl text-[#0B1A1A] outline-none"
              />
              <input
                type="text"
                placeholder="Phone or email"
                className="w-full h-12 px-4 bg-[#F5F3EF] rounded-xl text-[#0B1A1A] outline-none"
              />
            </div>
            <button className="w-full h-14 bg-[#0A8F86] text-white rounded-2xl active:scale-[0.98] transition-transform">
              Send Invitation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
