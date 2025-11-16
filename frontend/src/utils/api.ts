const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://junction2025-backend-1087825056058.europe-north1.run.app';

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

export interface StartConversationRequest {
  userId?: number;
  agentId?: string;
  // phoneNumber removed - using in-app voice instead
}

export interface StartConversationResponse {
  success: boolean;
  session_id: string;
  agent_id: string;
  websocket_url: string;
  api_key: string;
  webhook_url: string;
  message: string;
}

export interface ConversationStatus {
  id: string;
  status: string;
  [key: string]: any;
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

/**
 * Start an ElevenLabs Conversational AI conversation
 * @param request - Conversation start request with phone number and optional userId/agentId
 * @returns Promise with conversation details
 */
export async function startElevenLabsConversation(
  request: StartConversationRequest
): Promise<StartConversationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversations/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: request.userId,
        agentId: request.agentId
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to start conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error starting ElevenLabs conversation:', error);
    throw error;
  }
}

/**
 * Get the status of an ElevenLabs conversation
 * @param conversationId - The conversation ID from startElevenLabsConversation
 * @returns Promise with conversation status
 */
export async function getConversationStatus(
  conversationId: string
): Promise<ConversationStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to get conversation status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting conversation status:', error);
    throw error;
  }
}

