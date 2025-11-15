
import React, { useState, useCallback } from 'react';
import type { Mentor, Learner } from './types';
import { Page } from './types';
import Header from './components/Header';
import Home from './components/Home';
import MentorForm from './components/MentorForm';
import LearnerForm from './components/LearnerForm';
import Dashboard from './components/Dashboard';
import { MOCK_MENTORS, MOCK_LEARNERS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);
  const [learners, setLearners] = useState<Learner[]>(MOCK_LEARNERS);

  const addMentor = useCallback((mentor: Omit<Mentor, 'id' | 'status' | 'created_at'>) => {
    setMentors(prev => [...prev, {
      ...mentor,
      id: prev.length + 100,
      status: 'available',
      created_at: new Date().toISOString(),
    }]);
    setCurrentPage(Page.Dashboard);
  }, []);

  const addLearner = useCallback((learner: Omit<Learner, 'id' | 'status' | 'created_at'>) => {
    setLearners(prev => [...prev, {
      ...learner,
      id: prev.length + 200,
      status: 'searching',
      created_at: new Date().toISOString(),
    }]);
    setCurrentPage(Page.Dashboard);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case Page.Home:
        return <Home setCurrentPage={setCurrentPage} />;
      case Page.MentorForm:
        return <MentorForm addMentor={addMentor} />;
      case Page.LearnerForm:
        return <LearnerForm addLearner={addLearner} />;
      case Page.Dashboard:
        return <Dashboard mentors={mentors} learners={learners} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header setCurrentPage={setCurrentPage} />
      <main className="p-4 md:p-8">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Generations Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
