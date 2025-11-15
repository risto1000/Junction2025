import { useState, useEffect } from 'react';
import { X, Mic, Check } from 'lucide-react';
import { createVoiceProfile } from '../utils/api';

interface VoiceOnboardingModalProps {
  userId?: number | null;
  onComplete: (profileData: any) => void;
  onClose: () => void;
}

const steps = [
  { id: 1, title: 'Interests', question: "What activities do you enjoy?" },
  { id: 2, title: 'Career highlights', question: "Tell me about your work experience" },
  { id: 3, title: 'Hobbies', question: "What hobbies bring you joy?" },
  { id: 4, title: 'Availability', question: "When are you usually free?" },
  { id: 5, title: 'Safety preferences', question: "What would make you feel safe?" },
];

export function VoiceOnboardingModal({ userId, onComplete, onClose }: VoiceOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [waveformHeights, setWaveformHeights] = useState(Array(20).fill(0));
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: 'Jari Koskinen',
    tagline: 'Retired carpenter — loves walks & woodworking',
    location: 'Helsinki, Finland',
    hobbies: ['Woodworking', 'Duck Walks', 'Swimming', 'Knitting']
  });

  // Simulate voice recording animation
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveformHeights(Array(20).fill(0).map(() => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setWaveformHeights(Array(20).fill(0));
    }
  }, [isRecording]);

  // Auto-progress through steps
  useEffect(() => {
    if (!showEditScreen && currentStep < steps.length) {
      setIsRecording(true);
      const timer = setTimeout(() => {
        // Add simulated transcript
        const sampleTranscripts = [
          "I enjoy walking in nature, especially watching ducks at the park.",
          "I worked as a carpenter for 40 years, specializing in furniture making.",
          "I love woodworking, swimming, and I've recently taken up knitting.",
          "I'm usually free in mornings and early afternoons, weekdays work best.",
          "I'd like family to know when I attend events, and prefer public meetup spots."
        ];
        setTranscripts(prev => [...prev, sampleTranscripts[currentStep]]);
        setIsRecording(false);
        
        if (currentStep === steps.length - 1) {
          setTimeout(() => setShowEditScreen(true), 500);
        } else {
          setTimeout(() => setCurrentStep(currentStep + 1), 500);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, showEditScreen]);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Prepare profile data from ElevenLabs output and user edits
      // In a real implementation, this would come from ElevenLabs API response
      const elevenLabsProfileData = {
        voice_profile_id: `voice_${Date.now()}`, // This would come from ElevenLabs API
        full_name: editFormData.name,
        age: 68, // This would come from ElevenLabs analysis
        tagline: editFormData.tagline,
        location: editFormData.location,
        hobbies: editFormData.hobbies,
        career_highlights: [
          { company: 'Helsinki Construction', title: 'Master Carpenter', years: '1978-2015' }
        ],
        achievements: ['Master Carpenter', 'Community Mentor'],
        // Additional data from ElevenLabs would be included here
      };

      // Send to backend API
      const userData = await createVoiceProfile(elevenLabsProfileData, userId || undefined);
      
      // Transform backend response to frontend format
      const profileData = {
        id: userData.id,
        name: userData.full_name || editFormData.name,
        age: userData.age || 68,
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
              <label className="text-[#5D6A6A]">Hobbies (from voice)</label>
              <div className="flex flex-wrap gap-2">
                {editFormData.hobbies.map((hobby, idx) => (
                  <div key={idx} className="px-4 py-2 bg-[#0A8F86]/10 text-[#0A8F86] rounded-full">
                    {hobby}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#5D6A6A]">Safety preferences</label>
              <p className="text-[#0B1A1A] text-sm p-4 bg-[#F5F3EF] rounded-xl">
                Family can see event check-ins. Prefer public meetup locations.
              </p>
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
          {currentStep + 1} of {steps.length} — {steps[currentStep].title}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0A8F86] transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Voice Call Interface */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Microphone Icon */}
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 ${
          isRecording ? 'bg-[#FF7A6C]' : 'bg-white/20'
        } transition-colors`}>
          <Mic className="w-16 h-16 text-white" />
        </div>

        {/* Question */}
        <p className="text-white text-center text-xl mb-8">
          {steps[currentStep].question}
        </p>

        {/* Waveform Visualization */}
        {isRecording && (
          <div className="flex items-center justify-center gap-1 h-24 mb-6">
            {waveformHeights.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-[#0A8F86] rounded-full transition-all duration-100"
                style={{ height: `${4 + height * 0.6}px` }}
              />
            ))}
          </div>
        )}

        {/* Live Transcript */}
        {transcripts[currentStep] && (
          <div className="w-full max-w-md p-4 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-white/90 text-sm">
              {transcripts[currentStep]}
            </p>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="px-6 pb-[34px] pt-6">
        <p className="text-white/70 text-center">
          {isRecording ? 'Listening...' : 'Processing your response...'}
        </p>
      </div>
    </div>
  );
}
