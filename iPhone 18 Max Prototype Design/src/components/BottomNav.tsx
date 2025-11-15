import { User, Users, Heart } from 'lucide-react';
import type { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const tabs = [
    { id: 'profile' as Screen, label: 'Profile', icon: User },
    { 
      id: 'events' as Screen, 
      label: 'Events', 
      icon: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    { id: 'family' as Screen, label: 'Family', icon: Users },
    { id: 'favorites' as Screen, label: 'Favourites', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-[#E8E6E3] pb-[34px]">
      <div className="flex items-center justify-around px-4 h-[56px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] active:scale-95 transition-transform"
            >
              {isActive ? (
                typeof Icon === 'function' ? (
                  <div className="text-[#0A8F86]">
                    <Icon />
                  </div>
                ) : (
                  <Icon className="w-6 h-6 fill-[#0A8F86] text-[#0A8F86]" strokeWidth={2} />
                )
              ) : (
                typeof Icon === 'function' ? (
                  <div className="text-[#5D6A6A]">
                    <Icon />
                  </div>
                ) : (
                  <Icon className="w-6 h-6 text-[#5D6A6A]" strokeWidth={1.5} />
                )
              )}
              <span 
                className={`text-[13px] font-medium ${
                  isActive ? 'text-[#0A8F86]' : 'text-[#5D6A6A]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}