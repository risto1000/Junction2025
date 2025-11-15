
import React from 'react';
import type { Page } from '../types';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setCurrentPage }) => {
  return (
    <div className="container mx-auto text-center">
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 lg:p-16 transform transition hover:scale-105 duration-300">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Share a Lifetime of Experience.</h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Generations Connect brings together experienced mentors and eager young learners. Whether you want to teach a skill or learn one, this is the place where knowledge is passed down and new friendships are formed.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage('learner-form' as Page)}
            className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-200 shadow-lg"
          >
            I Want to Learn
          </button>
          <button
            onClick={() => setCurrentPage('mentor-form' as Page)}
            className="w-full md:w-auto bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-300 transition-transform transform hover:scale-105 duration-200 shadow-lg"
          >
            I Want to Teach
          </button>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          title="Meaningful Connections"
          description="Bridge the generational gap by sharing stories, skills, and laughter. Create lasting bonds in your community."
        />
        <FeatureCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
          title="Lifelong Learning"
          description="It's never too late to learn something new. From coding to cooking, our mentors offer a wide range of skills."
        />
        <FeatureCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5 10m9 0a2 2 0 012 2v5a2 2 0 01-2 2h-4m-2 0a2 2 0 01-2-2v-7a2 2 0 012-2h2" /></svg>}
          title="Intelligent Matching"
          description="Our AI-powered system, using Google's Gemini, helps find the perfect mentor-learner match based on skills and availability."
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default Home;
