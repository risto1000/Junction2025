
import React, { useState, useCallback } from 'react';
import type { Mentor, Learner, MatchResult } from '../types';
import { findMatchForMentor } from '../services/geminiService';

interface DashboardProps {
  mentors: Mentor[];
  learners: Learner[];
}

const Dashboard: React.FC<DashboardProps> = ({ mentors, learners }) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableMentors = mentors.filter(m => m.status === 'available');
  const searchingLearners = learners.filter(l => l.status === 'searching');

  const handleFindMatches = useCallback(async () => {
    if (!process.env.API_KEY) {
      alert("API_KEY environment variable is not set. Matching is disabled.");
      return;
    }
    setIsLoading(true);
    
    const initialMatchState: MatchResult[] = availableMentors.map(mentor => ({
        mentor,
        learner: null,
        matchStatus: 'PENDING'
    }));
    setMatches(initialMatchState);

    const matchPromises = availableMentors.map(async (mentor) => {
      try {
        const matchedLearnerId = await findMatchForMentor(mentor, searchingLearners);
        if (matchedLearnerId) {
          const matchedLearner = searchingLearners.find(l => l.id === matchedLearnerId);
          return { mentor, learner: matchedLearner || null, matchStatus: matchedLearner ? 'MATCH_FOUND' : 'NO_MATCH_FOUND' } as MatchResult;
        } else {
          return { mentor, learner: null, matchStatus: 'NO_MATCH_FOUND' } as MatchResult;
        }
      } catch (error) {
        console.error(`Error finding match for ${mentor.full_name}:`, error);
        return { mentor, learner: null, matchStatus: 'ERROR' } as MatchResult;
      }
    });
    
    // Update state as each promise resolves for better UX
    for (const promise of matchPromises) {
        const result = await promise;
        setMatches(prev => prev.map(m => m.mentor.id === result.mentor.id ? result : m));
    }

    setIsLoading(false);
  }, [availableMentors, searchingLearners]);

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Matching Dashboard</h2>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <p className="text-gray-600 flex-grow">
            Click the button to use the Gemini AI to find the best matches between available mentors and searching learners.
            </p>
            <button
                onClick={handleFindMatches}
                disabled={isLoading}
                className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow"
            >
                {isLoading ? (
                <>
                    <Spinner />
                    Finding Matches...
                </>
                ) : 'Find All Matches'}
            </button>
        </div>
      </div>

      {matches.length > 0 && <MatchResults matches={matches} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProfileList title="Available Mentors" profiles={availableMentors} type="mentor" />
        <ProfileList title="Searching Learners" profiles={searchingLearners} type="learner" />
      </div>
    </div>
  );
};

const ProfileList: React.FC<{ title: string; profiles: (Mentor | Learner)[]; type: 'mentor' | 'learner' }> = ({ title, profiles, type }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title} ({profiles.length})</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {profiles.length > 0 ? profiles.map(profile => (
                <div key={profile.id} className="p-4 border rounded-lg bg-gray-50">
                    <p className="font-bold text-lg text-gray-800">{profile.full_name}</p>
                    <p className="text-sm text-gray-600">
                        {type === 'mentor' ? `Skills: ${(profile as Mentor).skills}` : `Wants to Learn: ${(profile as Learner).desired_skills}`}
                    </p>
                    <p className="text-sm text-gray-600">Availability: {profile.availability}</p>
                </div>
            )) : <p className="text-gray-500 italic">No {type}s found.</p>}
        </div>
    </div>
);

const MatchResults: React.FC<{ matches: MatchResult[] }> = ({ matches }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Potential Matches</h3>
        <div className="space-y-4">
            {matches.map(({ mentor, learner, matchStatus }) => (
                <div key={mentor.id} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-4 border rounded-lg transition-all duration-300">
                    <div className="font-semibold text-gray-700">Mentor: {mentor.full_name}</div>
                    <div className="flex items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <div>
                        {matchStatus === 'PENDING' && <div className="flex items-center gap-2 text-gray-500"><Spinner />Matching...</div>}
                        {matchStatus === 'ERROR' && <div className="text-red-500 font-semibold">Error finding match</div>}
                        {matchStatus === 'NO_MATCH_FOUND' && <div className="text-yellow-600 font-semibold">No suitable match found</div>}
                        {matchStatus === 'MATCH_FOUND' && learner && (
                            <div className="bg-green-100 text-green-800 p-2 rounded-md">
                                <p className="font-bold">Match: {learner.full_name}</p>
                                <p className="text-sm">Skills align on: {mentor.skills} &rarr; {learner.desired_skills}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Spinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


export default Dashboard;
