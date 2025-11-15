import { useState } from 'react';
import { X, Mic, Check } from 'lucide-react';
import { createVoiceProfile } from '../utils/api';
import { RealTimeVoiceConversation } from './RealTimeVoiceConversation';
import { ElevenLabsWidget } from './ElevenLabsWidget';

interface VoiceOnboardingModalProps {
  userId?: number | null;
  onComplete: (profileData: any) => void;
  onClose: () => void;
}

export function VoiceOnboardingModal({ userId, onComplete, onClose }: VoiceOnboardingModalProps) {
  const [useWidget, setUseWidget] = useState(true); // Toggle between widget and custom
  const [showConversation, setShowConversation] = useState(false);
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversationData, setConversationData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    tagline: '',
    location: '',
    hobbies: [] as string[],
    profession: '',
    availability: ''
  });

  // Start conversation when component mounts or when user clicks record
  const handleStartConversation = () => {
    setShowConversation(true);
  };

  // Handle conversation completion - extract data from webhook response
  const handleConversationComplete = async (transcript: string, userDescription: any) => {
    console.log('Conversation completed:', { transcript, userDescription });
    
    // Extract data from ElevenLabs response
    // The userDescription comes from the webhook payload
    const extractedData = {
      name: userDescription?.name || userDescription?.full_name || '',
      tagline: userDescription?.tagline || userDescription?.bio || '',
      location: userDescription?.location || '',
      profession: userDescription?.profession || '',
      availability: userDescription?.availability || '',
      hobbies: userDescription?.hobbies || (userDescription?.interests ? [userDescription.interests] : []),
      // Try to extract more structured data if available
      career_highlights: userDescription?.career_highlights || [],
      achievements: userDescription?.achievements || []
    };

    setConversationData({ transcript, userDescription, extractedData });
    setEditFormData({
      name: extractedData.name,
      tagline: extractedData.tagline || `${extractedData.profession || ''} — ${extractedData.location || ''}`.trim(),
      location: extractedData.location,
      hobbies: Array.isArray(extractedData.hobbies) ? extractedData.hobbies : [],
      profession: extractedData.profession,
      availability: extractedData.availability
    });
    
    setShowConversation(false);
    setShowEditScreen(true);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Prepare profile data from conversation response and user edits
      const elevenLabsProfileData = {
        voice_profile_id: conversationData?.userDescription?.voice_profile_id || `voice_${Date.now()}`,
        full_name: editFormData.name,
        tagline: editFormData.tagline,
        location: editFormData.location,
        hobbies: editFormData.hobbies,
        career_highlights: conversationData?.extractedData?.career_highlights || [],
        achievements: conversationData?.extractedData?.achievements || [],
        // Include raw conversation data for reference
        ...(conversationData?.userDescription && { 
          raw_conversation_data: conversationData.userDescription 
        })
      };

      // Send to backend API
      const userData = await createVoiceProfile(elevenLabsProfileData, userId || undefined);
      
      // Transform backend response to frontend format
      const profileData = {
        id: userData.id,
        name: userData.full_name || editFormData.name,
        age: userData.age,
        tagline: userData.tagline || editFormData.tagline,
        location: userData.location || editFormData.location,
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop',
        careerHighlights: Array.isArray(userData.career_highlights) 
          ? userData.career_highlights 
          : (typeof userData.career_highlights === 'string' ? JSON.parse(userData.career_highlights) : []),
        achievements: Array.isArray(userData.achievements)
          ? userData.achievements
          : (typeof userData.achievements === 'string' ? JSON.parse(userData.achievements) : []),
        hobbies: Array.isArray(userData.hobbies)
          ? userData.hobbies
          : (typeof userData.hobbies === 'string' ? JSON.parse(userData.hobbies) : editFormData.hobbies),
        microApprenticeshipOffer: userData.micro_apprenticeship_offer || '',
        offeringApprenticeship: userData.offering_apprenticeship || false,
      };

      onComplete(profileData);
    } catch (error) {
      console.error('Error creating voice profile:', error);
      alert('Failed to create profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show real-time conversation component
  if (showConversation) {
    // Use widget if enabled, otherwise use custom implementation
    if (useWidget) {
      return (
        <ElevenLabsWidget
          agentId="agent_5901ka39kp8vf3j88v13q8a2n0k5"
          onComplete={(data) => {
            console.log('Widget conversation completed:', data);
            // Widget doesn't provide transcript/userDescription directly
            // We'll need to fetch from backend webhook
            handleConversationComplete('', data);
          }}
          onClose={() => {
            setShowConversation(false);
            onClose();
          }}
        />
      );
    } else {
      return (
        <RealTimeVoiceConversation
          userId={userId}
          onComplete={handleConversationComplete}
          onClose={() => {
            setShowConversation(false);
            onClose();
          }}
        />
      );
    }
  }

  if (showEditScreen) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-[#E8E6E3] px-6 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-[#0B1A1A]">Review Your Profile</h3>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-[#5D6A6A]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-[#5D6A6A] mt-1">Tap any field to edit</p>
          </div>

          {/* Auto-filled Fields */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[#5D6A6A]">Name</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full h-12 px-4 bg-[#F5F3EF] rounded-xl text-[#0B1A1A] border-2 border-transparent focus:border-[#0A8F86] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#5D6A6A]">Tagline</label>
              <input
                type="text"
                value={editFormData.tagline}
                onChange={(e) => setEditFormData(prev => ({ ...prev, tagline: e.target.value }))}
                className="w-full h-12 px-4 bg-[#F5F3EF] rounded-xl text-[#0B1A1A] border-2 border-transparent focus:border-[#0A8F86] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#5D6A6A]">Location</label>
              <input
                type="text"
                value={editFormData.location}
                onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full h-12 px-4 bg-[#F5F3EF] rounded-xl text-[#0B1A1A] border-2 border-transparent focus:border-[#0A8F86] outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#5D6A6A]">Profession</label>
              <input
                type="text"
                value={editFormData.profession}
                onChange={(e) => setEditFormData(prev => ({ ...prev, profession: e.target.value }))}
                className="w-full h-12 px-4 bg-[#F5F3EF] rounded-xl text-[#0B1A1A] border-2 border-transparent focus:border-[#0A8F86] outline-none"
                placeholder="Your profession"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#5D6A6A]">Hobbies (from voice)</label>
              <div className="flex flex-wrap gap-2">
                {editFormData.hobbies.length > 0 ? (
                  editFormData.hobbies.map((hobby, idx) => (
                    <div key={idx} className="px-4 py-2 bg-[#0A8F86]/10 text-[#0A8F86] rounded-full">
                      {hobby}
                    </div>
                  ))
                ) : (
                  <p className="text-[#5D6A6A] text-sm">No hobbies extracted from conversation</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#5D6A6A]">Availability</label>
              <input
                type="text"
                value={editFormData.availability}
                onChange={(e) => setEditFormData(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full h-12 px-4 bg-[#F5F3EF] rounded-xl text-[#0B1A1A] border-2 border-transparent focus:border-[#0A8F86] outline-none"
                placeholder="When are you usually available?"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-white border-t border-[#E8E6E3] p-6 rounded-b-3xl">
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="w-full h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              <span>{isSubmitting ? 'Creating profile...' : userId ? 'Update profile' : 'Looks good — Create profile'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0B1A1A] z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[59px] pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white">Voice Onboarding</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-white/70">
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/70 mt-2">
          Start a conversation to create your profile
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Microphone Icon */}
        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-8 bg-white/20">
          <Mic className="w-16 h-16 text-white" />
        </div>

        {/* Instructions */}
        <p className="text-white text-center text-xl mb-8 max-w-md">
          Click the button below to start a voice conversation. The AI will ask you questions about yourself and help create your profile.
        </p>

        {/* Start Button */}
        <button
          onClick={handleStartConversation}
          className="px-8 py-4 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-3 text-lg font-medium hover:bg-[#0a7a72] transition-colors active:scale-[0.98]"
        >
          <Mic className="w-5 h-5" />
          <span>Start Voice Conversation</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-[34px] pt-6">
        <p className="text-white/50 text-center text-sm">
          Your conversation will be used to automatically fill in your profile
        </p>
      </div>
    </div>
  );
}
