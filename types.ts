
export interface Mentor {
  id: number;
  phone_number: string;
  full_name: string;
  skills: string; // Comma-separated
  availability: string;
  preferred_location: string;
  status: 'available' | 'matched' | 'inactive';
  created_at: string;
}

export interface Learner {
  id: number;
  phone_number: string;
  full_name: string;
  desired_skills: string; // Comma-separated
  availability: string;
  status: 'searching' | 'matched' | 'inactive';
  created_at: string;
}

export interface MatchResult {
  mentor: Mentor;
  learner: Learner | null;
  matchStatus: 'MATCH_FOUND' | 'NO_MATCH_FOUND' | 'ERROR' | 'PENDING';
}

export enum Page {
    Home = 'home',
    MentorForm = 'mentor-form',
    LearnerForm = 'learner-form',
    Dashboard = 'dashboard'
}
