import { Mic, Edit3 } from 'lucide-react';

interface SplashScreenProps {
  onVoiceOnboarding: () => void;
  onManualOnboarding: () => void;
}

export function SplashScreen({ onVoiceOnboarding, onManualOnboarding }: SplashScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#FCFBF9] to-[#F5F3EF]">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0A8F86] to-[#0D6B64] flex items-center justify-center shadow-lg">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
            <circle cx="33" cy="15" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
            <circle cx="24" cy="33" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
            <path d="M19 18 L24 27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M29 18 L24 27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-[#0B1A1A] mb-2">ApprenticeCircles+</h1>
        <p className="text-[#5D6A6A]">Meet, learn, belong.</p>
      </div>

      {/* Onboarding Prompt */}
      <div className="w-full max-w-sm mt-8">
        <p className="text-center text-[#0B1A1A] mb-6">
          Prefer voice onboarding?
        </p>

        {/* Voice Onboarding Button */}
        <button
          onClick={onVoiceOnboarding}
          className="w-full h-14 bg-[#0A8F86] text-white rounded-2xl flex items-center justify-center gap-3 mb-4 active:scale-[0.98] transition-transform shadow-md"
        >
          <Mic className="w-5 h-5" />
          <span>Call me now</span>
        </button>

        {/* Manual Onboarding Button */}
        <button
          onClick={onManualOnboarding}
          className="w-full h-14 bg-white text-[#0A8F86] border-2 border-[#0A8F86] rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
        >
          <Edit3 className="w-5 h-5" />
          <span>Type details</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-[#5D6A6A]">
        <p className="text-sm">Voice-first, intergenerational connections</p>
      </div>
    </div>
  );
}
