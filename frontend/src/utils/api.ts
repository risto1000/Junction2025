const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface VoiceProfileData {
  user_id?: number;
  voice_profile_id?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  tagline?: string;
  location?: string;
  avatar?: string;
  career_highlights?: Array<{ company: string; title: string; years: string }> | string;
  achievements?: string[] | string;
  hobbies?: string[] | string;
  micro_apprenticeship_offer?: string;
  offering_apprenticeship?: boolean;
}

export async function createVoiceProfile(
  data: VoiceProfileData,
  userId?: number
): Promise<any> {
  try {
    const payload = {
      ...data,
      user_id: userId || data.user_id
    };

    const response = await fetch(`${API_BASE_URL}/api/users/voice-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to create voice profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating voice profile:', error);
    throw error;
  }
}

