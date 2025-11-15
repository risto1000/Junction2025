
import type { Mentor, Learner } from './types';

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 1,
    phone_number: '555-0101',
    full_name: 'Eleanor Vance',
    skills: 'Knitting, Crochet, Baking',
    availability: 'Tuesday and Thursday afternoons',
    preferred_location: 'Local community center',
    status: 'available',
    created_at: '2023-10-26T10:00:00Z',
  },
  {
    id: 2,
    phone_number: '555-0102',
    full_name: 'Bernard Shaw',
    skills: 'Woodworking, Gardening, Basic car maintenance',
    availability: 'Weekends',
    preferred_location: 'My workshop',
    status: 'available',
    created_at: '2023-10-26T11:30:00Z',
  },
  {
    id: 3,
    phone_number: '555-0103',
    full_name: 'Patricia Fields',
    skills: 'Playing the guitar, Songwriting',
    availability: 'Monday evenings',
    preferred_location: 'Library study room',
    status: 'matched',
    created_at: '2023-10-25T09:00:00Z',
  },
];

export const MOCK_LEARNERS: Learner[] = [
  {
    id: 101,
    phone_number: '555-0201',
    full_name: 'James Peterson',
    desired_skills: 'Woodworking, home repair',
    availability: 'Saturday mornings',
    status: 'searching',
    created_at: '2023-10-26T14:00:00Z',
  },
  {
    id: 102,
    phone_number: '555-0202',
    full_name: 'Sarah Chen',
    desired_skills: 'Knitting, learning to make sweaters',
    availability: 'Thursday afternoons',
    status: 'searching',
    created_at: '2023-10-26T15:00:00Z',
  },
   {
    id: 103,
    phone_number: '555-0203',
    full_name: 'Michael Rodriguez',
    desired_skills: 'Playing the piano',
    availability: 'Any weekday evening',
    status: 'searching',
    created_at: '2023-10-26T16:00:00Z',
  },
];
