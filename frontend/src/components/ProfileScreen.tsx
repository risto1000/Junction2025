import { useState, useEffect } from 'react';
import { Settings, Share2, BarChart3, Mic, Edit2, Check, X, Plus, Users } from 'lucide-react';

interface ProfileScreenProps {
  profile: {
    name: string;
    age: number;
    tagline: string;
    location: string;
    avatar: string;
    careerHighlights: Array<{ company: string; title: string; years: string }>;
    achievements: string[];
    hobbies: string[];
    microApprenticeshipOffer: string;
    offeringApprenticeship: boolean;
  };
  userId?: number | null;
  isEditing: boolean;
  onEditToggle: () => void;
  onProfileUpdate: (profile: any) => void;
  onHostDashboard: () => void;
  onStartVoiceOnboarding: () => void;
}

export function ProfileScreen({ profile, userId, isEditing, onEditToggle, onProfileUpdate, onHostDashboard, onStartVoiceOnboarding }: ProfileScreenProps) {
  const [localProfile, setLocalProfile] = useState(profile);
  const [editingHobby, setEditingHobby] = useState<string | null>(null);
  const [showRerecordConfirm, setShowRerecordConfirm] = useState(false);

  // Update localProfile when profile prop changes
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const handleSave = () => {
    onProfileUpdate(localProfile);
    onEditToggle();
  };

  const handleCancel = () => {
    setLocalProfile(profile);
    onEditToggle();
  };

  const toggleApprenticeship = () => {
    setLocalProfile(prev => ({ ...prev, offeringApprenticeship: !prev.offeringApprenticeship }));
  };

  return (
    <div className={`min-h-screen bg-[#FCFBF9] pb-8 ${showRerecordConfirm ? 'overflow-hidden max-h-screen' : ''}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-6 bg-gradient-to-b from-[#0A8F86]/5 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[#0B1A1A]">Profile</h1>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button className="w-10 h-10 flex items-center justify-center text-[#5D6A6A]">
                <Settings className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <img 
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full mb-2 px-3 py-2 bg-[#F5F3EF] rounded-xl text-[#0B1A1A] border-2 border-[#0A8F86]"
                />
              ) : (
                <h2 className="text-[#0B1A1A] mb-1">{profile.name}, {profile.age}</h2>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={localProfile.tagline}
                  onChange={(e) => setLocalProfile(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full mb-2 px-3 py-2 bg-[#F5F3EF] rounded-xl text-[#5D6A6A] border-2 border-[#0A8F86]"
                />
              ) : (
                <p className="text-[#5D6A6A] mb-2">{profile.tagline}</p>
              )}
              <p className="text-[#5D6A6A] flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.location}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          {!isEditing && (
            <div className="flex gap-1.5 mt-4">
              <button className="flex-1 h-11 bg-[#F5F3EF] text-[#0A8F86] rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform">
                <Share2 className="w-4 h-4" />
                <span className="text-[15px]">Share</span>
              </button>
              <button 
                onClick={onHostDashboard}
                className="flex-1 h-11 bg-[#F5F3EF] text-[#0A8F86] rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
              >
                <Users className="w-4 h-4" />
                <span className="text-[15px]">My Events</span>
              </button>
              <button className="flex-1 h-11 bg-[#F5F3EF] text-[#0A8F86] rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform">
                <BarChart3 className="w-4 h-4" />
                <span className="text-[15px]">Stats</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 space-y-6">
        {/* Career Highlights */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-[#0B1A1A] mb-4">Career Highlights</h3>
          <div className="space-y-4">
            {profile.careerHighlights.map((career, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A8F86]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#0A8F86]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[#0B1A1A]">{career.title}</p>
                  <p className="text-[#5D6A6A]">{career.company}</p>
                  <p className="text-[#5D6A6A] text-sm">{career.years}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-[#0B1A1A] mb-4">Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {profile.achievements.map((achievement, idx) => (
              <div key={idx} className="px-4 py-2 bg-[#FF7A6C]/10 text-[#FF7A6C] rounded-full flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hobbies & Routines */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0B1A1A]">Hobbies & Routines</h3>
            {!isEditing && (
              <button onClick={onEditToggle} className="text-[#0A8F86] flex items-center gap-1">
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {localProfile.hobbies.map((hobby, idx) => (
              <div 
                key={idx} 
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  isEditing ? 'bg-[#0A8F86]/10 text-[#0A8F86] border-2 border-[#0A8F86]/30' : 'bg-[#F5F3EF] text-[#0B1A1A]'
                }`}
              >
                <span>{hobby}</span>
                {isEditing && (
                  <button className="w-4 h-4 rounded-full bg-[#0A8F86] text-white flex items-center justify-center">
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button className="px-4 py-2 rounded-full bg-[#0A8F86]/10 text-[#0A8F86] flex items-center gap-2 border-2 border-dashed border-[#0A8F86]/30">
                <Plus className="w-4 h-4" />
                <span>Add hobby</span>
              </button>
            )}
          </div>
        </div>

        {/* Micro-Apprenticeship */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#0B1A1A]">Micro-Apprenticeship Offer</h3>
            <button
              onClick={toggleApprenticeship}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                localProfile.offeringApprenticeship ? 'bg-[#0A8F86]' : 'bg-[#E8E6E3]'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                localProfile.offeringApprenticeship ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          {localProfile.offeringApprenticeship && (
            <div className="p-4 bg-[#F5F3EF] rounded-2xl">
              <p className="text-[#0B1A1A] mb-3">{profile.microApprenticeshipOffer}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-[#5D6A6A] text-sm">30 min</span>
                <span className="px-3 py-1 bg-white rounded-full text-[#5D6A6A] text-sm">Free</span>
                <span className="px-3 py-1 bg-white rounded-full text-[#5D6A6A] text-sm">Max 2 people</span>
              </div>
              {isEditing && (
                <button className="mt-3 text-[#0A8F86] flex items-center gap-1">
                  <Edit2 className="w-4 h-4" />
                  <span>Edit offer details</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Safety Preferences */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-[#0B1A1A] mb-4">Safety & Sharing Controls</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[#0B1A1A]">Share activity check-ins with family</p>
                <p className="text-[#5D6A6A] text-sm">Let family know when you attend events</p>
              </div>
              <div className="w-12 h-7 rounded-full bg-[#0A8F86] relative">
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[#0B1A1A]">Approximate location sharing</p>
                <p className="text-[#5D6A6A] text-sm">Share general area during events</p>
              </div>
              <div className="w-12 h-7 rounded-full bg-[#0A8F86] relative">
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[#0B1A1A]">Emergency contact visible</p>
                <p className="text-[#5D6A6A] text-sm">Event organizers can see emergency info</p>
              </div>
              <div className="w-12 h-7 rounded-full bg-[#E8E6E3] relative">
                <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Voice Profile */}
        <div className="bg-gradient-to-br from-[#0A8F86]/10 to-[#FF7A6C]/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#0A8F86] flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#0B1A1A]">Voice Profile</h3>
              <p className="text-[#5D6A6A]">Created via onboarding call</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onEditToggle}
              className="flex-1 h-11 bg-white text-[#0A8F86] rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Manually</span>
            </button>
            <button 
              onClick={() => setShowRerecordConfirm(true)}
              className="flex-1 h-11 bg-white text-[#0A8F86] rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Mic className="w-4 h-4" />
              <span>Re-record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Mode Actions */}
      {isEditing && (
        <div className="fixed bottom-[90px] left-0 right-0 max-w-[430px] mx-auto px-4 pb-4 bg-gradient-to-t from-[#FCFBF9] via-[#FCFBF9] to-transparent pt-6">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 h-14 bg-white border-2 border-[#E8E6E3] text-[#5D6A6A] rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Check className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Re-record Confirmation */}
      {showRerecordConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-2xl">
            <h3 className="text-[#0B1A1A] mb-3 text-center">Re-record Your Profile?</h3>
            <p className="text-[#5D6A6A] mb-6 text-center">Do you want to re-record your profile?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRerecordConfirm(false)}
                className="flex-1 h-12 bg-[#F5F3EF] text-[#5D6A6A] rounded-xl active:scale-[0.98] transition-transform text-center"
              >
                Nevermind
              </button>
              <button
                onClick={() => {
                  setShowRerecordConfirm(false);
                  onStartVoiceOnboarding();
                }}
                className="flex-1 h-12 bg-[#0A8F86] text-white rounded-xl active:scale-[0.98] transition-transform text-center"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}