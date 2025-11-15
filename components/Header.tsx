
import React from 'react';
import type { Page } from '../types';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  const NavButton: React.FC<{ page: Page; label: string }> = ({ page, label }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home' as Page)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Generations Connect</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <NavButton page={'home' as Page} label="Home" />
          <NavButton page={'dashboard' as Page} label="Dashboard" />
          <NavButton page={'mentor-form' as Page} label="Become a Mentor" />
           <button
             onClick={() => setCurrentPage('learner-form' as Page)}
             className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow"
           >
            Find a Mentor
           </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
