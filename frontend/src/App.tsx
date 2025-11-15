import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { EventsScreen } from './components/EventsScreen';
import { FamilyScreen } from './components/FamilyScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { EventDetailScreen } from './components/EventDetailScreen';
import { HostDashboard } from './components/HostDashboard';
import { BottomNav } from './components/BottomNav';
import { VoiceOnboardingModal } from './components/VoiceOnboardingModal';
import { RSVPModal } from './components/RSVPModal';
import { ToastNotification } from './components/ToastNotification';
import { StatusBar } from './components/StatusBar';

export type Screen = 'splash' | 'profile' | 'events' | 'family' | 'favorites' | 'eventDetail' | 'hostDashboard';

export type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type Event = {
  id: string;
  title: string;
  organizer: string;
  organizerAvatar: string;
  organizerBadge: 'Senior-host' | 'Youth-host' | 'Community';
  organizerBio: string;
  time: string;
  date: string;
  location: string;
  description: string;
  distance: string;
  image: string;
  participants: string[]; // Keep for backwards compatibility with avatars
  participantDetails: Participant[]; // New detailed participant info
  capacity: number;
  spacesLeft: number;
  matchScore?: number;
  isMicroApprenticeship: boolean;
  accessibilityNotes: string;
  ageSuitability: string;
  latitude?: number;
  longitude?: number;
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('events'); // Changed default to 'events'
  const [showVoiceOnboarding, setShowVoiceOnboarding] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showHostEventModal, setShowHostEventModal] = useState(false);
  
  // Initialize userId from localStorage or generate new one
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem('userId');
    if (stored) {
      const parsed = parseInt(stored, 10);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  });
  
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: 0,
    tagline: '',
    location: '',
    avatar: '',
    careerHighlights: [] as Array<{ company: string; title: string; years: string }>,
    achievements: [] as string[],
    hobbies: [] as string[],
    microApprenticeshipOffer: '',
    offeringApprenticeship: false,
  });
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // Fetch user profile from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Only fetch if we have a userId
      const targetUserId = userId || (import.meta.env.VITE_DEFAULT_USER_ID ? parseInt(import.meta.env.VITE_DEFAULT_USER_ID) : null);
      
      if (!targetUserId) {
        // No user ID - show splash screen or empty profile
        setUserLoading(false);
        return;
      }

      try {
        setUserLoading(true);
        setUserError(null);
        const response = await fetch(`/api/users/${targetUserId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // User doesn't exist yet, use default empty profile
            setUserLoading(false);
            return;
          }
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await response.json();
        
        // Transform database format to frontend format
        setUserProfile({
          name: userData.full_name || '',
          age: userData.age || 0,
          tagline: userData.tagline || '',
          location: userData.location || '',
          avatar: userData.avatar || 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop',
          careerHighlights: userData.career_highlights 
            ? (typeof userData.career_highlights === 'string' 
                ? (() => {
                    try {
                      return JSON.parse(userData.career_highlights);
                    } catch {
                      return [];
                    }
                  })()
                : userData.career_highlights)
            : [],
          achievements: userData.achievements 
            ? (typeof userData.achievements === 'string' 
                ? (() => {
                    try {
                      return JSON.parse(userData.achievements);
                    } catch {
                      return [];
                    }
                  })()
                : userData.achievements)
            : [],
          hobbies: userData.hobbies 
            ? (typeof userData.hobbies === 'string' 
                ? (() => {
                    try {
                      return JSON.parse(userData.hobbies);
                    } catch {
                      return [];
                    }
                  })()
                : userData.hobbies)
            : [],
          microApprenticeshipOffer: userData.micro_apprenticeship_offer || '',
          offeringApprenticeship: userData.offering_apprenticeship || false,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserError(error instanceof Error ? error.message : 'Failed to load user profile');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const events: Event[] = [
    {
      id: '1',
      title: 'Morning Duck Walk — Kaivopuisto',
      organizer: 'Jari Koskinen',
      organizerAvatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop',
      organizerBadge: 'Senior-host',
      organizerBio: 'Retired carpenter who loves nature walks and meeting new people.',
      time: '09:30',
      date: 'Saturday, Nov 16',
      location: 'Kaivopuisto Park, Helsinki',
      description: 'Join us for a gentle morning walk to see the ducks and enjoy fresh air together.',
      distance: '0.8 km away',
      image: 'https://images.unsplash.com/photo-1551069613-1904dbdcda11?w=800&h=400&fit=crop',
      participants: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
      ],
      participantDetails: [
        { id: '1', firstName: 'Alice', lastName: 'Johnson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
        { id: '2', firstName: 'Bob', lastName: 'Smith', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop' },
        { id: '3', firstName: 'Charlie', lastName: 'Brown', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }
      ],
      capacity: 12,
      spacesLeft: 5,
      matchScore: 92,
      isMicroApprenticeship: false,
      accessibilityNotes: 'Flat paths, benches available',
      ageSuitability: 'All ages welcome',
      latitude: 60.1534,
      longitude: 24.9571
    },
    {
      id: '2',
      title: 'Intro to Chair Repair — Coffee & Tools',
      organizer: 'Jari Koskinen',
      organizerAvatar: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop',
      organizerBadge: 'Senior-host',
      organizerBio: 'Master carpenter with 40+ years experience, passionate about sharing traditional woodworking skills.',
      time: '14:00',
      date: 'Sunday, Nov 17',
      location: 'Community Workshop, Kallio',
      description: 'Learn basic chair repair techniques over coffee. Bring a wobbly chair or practice on ours!',
      distance: '1.2 km away',
      image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&h=400&fit=crop',
      participants: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
      ],
      participantDetails: [
        { id: '4', firstName: 'David', lastName: 'Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
        { id: '5', firstName: 'Eve', lastName: 'Davis', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' }
      ],
      capacity: 6,
      spacesLeft: 2,
      matchScore: 88,
      isMicroApprenticeship: true,
      accessibilityNotes: 'Workshop on ground floor, wheelchair accessible',
      ageSuitability: '16+ recommended',
      latitude: 60.1840,
      longitude: 24.9501
    },
    {
      id: '3',
      title: 'Intergenerational Story Circle',
      organizer: 'Mirka Lahti',
      organizerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      organizerBadge: 'Youth-host',
      organizerBio: 'Recent graduate passionate about preserving stories and building community connections.',
      time: '18:00',
      date: 'Wednesday, Nov 20',
      location: 'Central Library Oodi',
      description: 'Share and listen to life stories across generations. Tea and snacks provided.',
      distance: '2.1 km away',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=400&fit=crop',
      participants: [
        'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
      ],
      participantDetails: [
        { id: '6', firstName: 'Frank', lastName: 'Miller', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop' },
        { id: '7', firstName: 'Grace', lastName: 'Anderson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
        { id: '8', firstName: 'Hannah', lastName: 'Thomas', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
        { id: '9', firstName: 'Ian', lastName: 'Jackson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' }
      ],
      capacity: 15,
      spacesLeft: 8,
      matchScore: 76,
      isMicroApprenticeship: false,
      accessibilityNotes: 'Fully accessible venue',
      ageSuitability: 'All ages welcome',
      latitude: 60.1733,
      longitude: 24.9307
    },
    {
      id: '4',
      title: 'Cycling Mentorship Coffee',
      organizer: 'Mirka Lahti',
      organizerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      organizerBadge: 'Youth-host',
      organizerBio: 'Cycling enthusiast seeking mentorship from experienced carpenters and craftspeople.',
      time: '11:00',
      date: 'Saturday, Nov 23',
      location: 'Cafe Regatta',
      description: 'Casual coffee chat where I hope to learn from experienced mentors about career transitions.',
      distance: '3.4 km away',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=400&fit=crop',
      participants: [],
      participantDetails: [],
      capacity: 4,
      spacesLeft: 4,
      isMicroApprenticeship: true,
      accessibilityNotes: 'Small cafe with steps',
      ageSuitability: 'Adults',
      latitude: 60.1872,
      longitude: 24.9099
    },
    {
      id: '5',
      title: 'Weekend Knitting Circle',
      organizer: 'Anna Virtanen',
      organizerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      organizerBadge: 'Community',
      organizerBio: 'Community organizer passionate about bringing people together through crafts.',
      time: '15:00',
      date: 'Sunday, Nov 24',
      location: 'Community Center, Töölö',
      description: 'Bring your knitting projects or learn from experienced knitters. All skill levels welcome.',
      distance: '1.8 km away',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=400&fit=crop',
      participants: [
        'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop'
      ],
      participantDetails: [
        { id: '10', firstName: 'Jack', lastName: 'White', avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop' }
      ],
      capacity: 10,
      spacesLeft: 7,
      matchScore: 84,
      isMicroApprenticeship: false,
      accessibilityNotes: 'Ground floor, accessible',
      ageSuitability: 'All ages',
      latitude: 60.1756,
      longitude: 24.9201
    }
  ];

  const handleToggleFavorite = (eventId: string) => {
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
    const isFavoriting = !favorites.includes(eventId);
    showToast(isFavoriting ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleRSVP = (eventId: string, inviteFamily: boolean) => {
    setRsvpEvents(prev => [...prev, eventId]);
    setShowRSVPModal(false);
    showToast(inviteFamily ? "You're in — family invited!" : "You're in — we sent a reminder.");
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVoiceOnboardingComplete = (profileData: any) => {
    setUserProfile(prev => ({ ...prev, ...profileData }));
    // Update userId if we got one from the backend
    if (profileData.id && !userId) {
      setUserId(profileData.id);
      localStorage.setItem('userId', profileData.id.toString());
    }
    setShowVoiceOnboarding(false);
    setCurrentScreen('profile');
    showToast('Profile created successfully!');
  };

  const handleManualOnboarding = () => {
    setShowVoiceOnboarding(false);
    setCurrentScreen('profile');
    setIsProfileEditing(true);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen 
            onVoiceOnboarding={() => setShowVoiceOnboarding(true)}
            onManualOnboarding={handleManualOnboarding}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            profile={userProfile}
            userId={userId}
            isEditing={isProfileEditing}
            onEditToggle={() => setIsProfileEditing(!isProfileEditing)}
            onProfileUpdate={setUserProfile}
            onHostDashboard={() => setCurrentScreen('hostDashboard')}
            onStartVoiceOnboarding={() => setShowVoiceOnboarding(true)}
          />
        );
      case 'events':
        return (
          <EventsScreen 
            events={events}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onEventSelect={(event) => {
              setSelectedEvent(event);
              setCurrentScreen('eventDetail');
            }}
          />
        );
      case 'eventDetail':
        return selectedEvent ? (
          <EventDetailScreen 
            event={selectedEvent}
            isFavorite={favorites.includes(selectedEvent.id)}
            hasRSVP={rsvpEvents.includes(selectedEvent.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedEvent.id)}
            onRSVP={() => setShowRSVPModal(true)}
            onBack={() => setCurrentScreen('events')}
            onHostDashboard={() => setCurrentScreen('hostDashboard')}
          />
        ) : null;
      case 'family':
        return <FamilyScreen events={events} onEventSelect={(event) => {
          setSelectedEvent(event);
          setCurrentScreen('eventDetail');
        }} />;
      case 'favorites':
        return (
          <FavoritesScreen 
            events={events.filter(e => favorites.includes(e.id))}
            onToggleFavorite={handleToggleFavorite}
            onEventSelect={(event) => {
              setSelectedEvent(event);
              setCurrentScreen('eventDetail');
            }}
          />
        );
      case 'hostDashboard':
        return (
          <HostDashboard 
            event={selectedEvent || events[0]}
            onBack={() => setCurrentScreen(selectedEvent ? 'eventDetail' : 'events')}
          />
        );
      default:
        return null;
    }
  };

  const showBottomNav = currentScreen !== 'splash' && currentScreen !== 'eventDetail' && currentScreen !== 'hostDashboard';

  return (
    <div className="relative w-full min-h-screen bg-[#FCFBF9] overflow-hidden">
      {/* iPhone 18 Max Frame */}
      <div className="mx-auto max-w-[430px] min-h-screen bg-[#FCFBF9] relative">
        {/* Status Bar Safe Area */}
        <StatusBar />
        
        {/* Screen Content */}
        <div className={`${showBottomNav ? 'pb-[90px]' : ''}`}>
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNav 
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
          />
        )}

        {/* Modals */}
        {showVoiceOnboarding && (
          <VoiceOnboardingModal 
            userId={userId}
            onComplete={handleVoiceOnboardingComplete}
            onClose={() => setShowVoiceOnboarding(false)}
          />
        )}

        {showRSVPModal && selectedEvent && (
          <RSVPModal 
            event={selectedEvent}
            onConfirm={(inviteFamily) => handleRSVP(selectedEvent.id, inviteFamily)}
            onClose={() => setShowRSVPModal(false)}
          />
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <ToastNotification message={toastMessage} />
        )}

        {/* Home Indicator Safe Area */}
        <div className="h-[34px]" />
      </div>
    </div>
  );
}

export default App;