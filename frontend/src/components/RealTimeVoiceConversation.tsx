import { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2 } from 'lucide-react';
import { startElevenLabsConversation } from '../utils/api';

interface RealTimeVoiceConversationProps {
  userId?: number | null;
  agentId?: string;
  onComplete?: (transcript: string, userDescription: any) => void;
  onClose: () => void;
}

export function RealTimeVoiceConversation({ 
  userId, 
  agentId,
  onComplete, 
  onClose 
}: RealTimeVoiceConversationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize conversation session
  useEffect(() => {
    const initSession = async () => {
      try {
        const result = await startElevenLabsConversation({
          userId: userId || undefined,
          agentId: agentId
        });
        
        setSessionInfo(result);
        connectWebSocket(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start conversation');
        console.error('Failed to initialize session:', err);
      }
    };

    initSession();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [userId, agentId]);

  const connectWebSocket = async (session: any) => {
    try {
      // Create WebSocket connection to ElevenLabs
      // The WebSocket URL format for ElevenLabs Conversational AI
      // Format: wss://api.elevenlabs.io/v1/convai/conversation?agent_id=XXX&api_key=YYY
      const wsUrl = `${session.websocket_url}?agent_id=${encodeURIComponent(session.agent_id)}&api_key=${encodeURIComponent(session.api_key.trim())}`;
      console.log('Connecting to WebSocket:', wsUrl.replace(session.api_key, '***'));
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        // Start audio capture after connection is established
        setTimeout(() => {
          startAudioCapture();
        }, 500);
      };

      ws.onmessage = (event) => {
        try {
          // Handle both text and binary messages
          if (typeof event.data === 'string') {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } else if (event.data instanceof ArrayBuffer) {
            // Binary audio data from agent
            playAudio(event.data);
            setAgentSpeaking(true);
          } else if (event.data instanceof Blob) {
            // Convert blob to array buffer
            event.data.arrayBuffer().then((buffer) => {
              playAudio(buffer);
              setAgentSpeaking(true);
            });
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          // Try to handle as raw text
          if (typeof event.data === 'string') {
            console.log('Raw WebSocket message:', event.data);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please check your API key and agent ID.');
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        if (event.code !== 1000) {
          // Not a normal closure
          setError(`Connection closed: ${event.reason || 'Unknown error'}`);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
      setError('Failed to connect. Please check your API key and agent ID.');
    }
  };

  const startAudioCapture = async () => {
    try {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setError('WebSocket not connected. Please wait...');
        return;
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Match ElevenLabs expected format
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Create audio context for processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000
      });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      
      // Use ScriptProcessor for audio capture (widely supported)
      // Note: ScriptProcessor is deprecated but works reliably across browsers
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e: AudioProcessingEvent) => {
        if (isRecording && wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          // Convert Float32Array to Int16Array for WebSocket (PCM 16-bit)
          const int16Data = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            int16Data[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
          }
          // Send audio data to WebSocket
          try {
            wsRef.current.send(int16Data.buffer);
          } catch (sendError) {
            console.error('Error sending audio data:', sendError);
          }
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      
      setIsRecording(true);
      console.log('Audio capture started');
    } catch (err) {
      console.error('Failed to start audio capture:', err);
      setError(err instanceof Error ? err.message : 'Microphone access denied. Please allow microphone access.');
    }
  };

  const handleWebSocketMessage = (data: any) => {
    // Handle different message types from ElevenLabs
    if (data.type === 'audio') {
      // Play agent's audio response
      playAudio(data.audio);
      setAgentSpeaking(true);
    } else if (data.type === 'transcript') {
      // Update transcript
      setTranscript(prev => prev + ' ' + data.text);
    } else if (data.type === 'conversation_end' || data.event === 'conversation_end') {
      // Conversation completed
      setIsRecording(false);
      
      // Try to fetch user description from backend (webhook may have saved it)
      fetchUserDescriptionFromBackend(transcript, data.user_description || {});
    } else if (data.type === 'error') {
      setError(data.message || 'An error occurred');
    }
  };

  const playAudio = async (audioData: ArrayBuffer) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setAgentSpeaking(false);
      };
      
      source.start(0);
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  const fetchUserDescriptionFromBackend = async (transcript: string, fallbackData: any) => {
    try {
      // Wait a bit for webhook to be processed
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://junction2025-backend-1087825056058.europe-north1.run.app';
      const response = await fetch(`${API_BASE_URL}/api/user-descriptions/latest`);
      
      if (response.ok) {
        const data = await response.json();
        // Safely extract user description with proper error handling
        let userDescription: any = {};
        try {
          if (data.userDescription) {
            userDescription = data.userDescription;
          } else {
            userDescription = {
              name: data.name || '',
              profession: data.profession || '',
              location: data.location || '',
              availability: data.availability || '', // Safely handle availability
              ...fallbackData
            };
          }
          
          // Ensure all fields are strings to prevent parsing errors
          userDescription = {
            name: String(userDescription.name || ''),
            profession: String(userDescription.profession || ''),
            location: String(userDescription.location || ''),
            availability: String(userDescription.availability || ''), // Convert to string safely
            ...userDescription
          };
        } catch (parseError) {
          console.error('Error parsing user description:', parseError);
          userDescription = fallbackData;
        }
        
        if (onComplete) {
          onComplete(transcript, userDescription);
        }
      } else {
        // If fetch fails, use fallback data
        if (onComplete) {
          onComplete(transcript, fallbackData);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user description:', err);
      // Use fallback data if fetch fails
      if (onComplete) {
        onComplete(transcript, fallbackData);
      }
    }
  };

  const stopConversation = async () => {
    setIsRecording(false);
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Fetch user description when manually stopped
    if (transcript && onComplete) {
      await fetchUserDescriptionFromBackend(transcript, {});
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B1A1A] z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[59px] pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white">Voice Conversation</h2>
          <button 
            onClick={() => {
              stopConversation();
              onClose();
            }} 
            className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-white/70 mt-2">
          {isConnected ? (isRecording ? 'Listening...' : 'Connected') : 'Connecting...'}
        </p>
      </div>

      {/* Status Indicators */}
      <div className="px-6 pb-6 flex gap-4">
        <div className={`px-4 py-2 rounded-full ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {isConnected ? '● Connected' : '○ Connecting'}
        </div>
        {agentSpeaking && (
          <div className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Agent Speaking
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Microphone Icon */}
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-colors ${
          isRecording ? 'bg-[#FF7A6C] animate-pulse' : 'bg-white/20'
        }`}>
          {isRecording ? (
            <Mic className="w-16 h-16 text-white" />
          ) : (
            <MicOff className="w-16 h-16 text-white/50" />
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="w-full max-w-md p-4 bg-white/10 rounded-2xl border border-white/20 mb-6">
            <p className="text-white/90 text-sm">{transcript}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-md p-4 bg-red-500/20 rounded-2xl border border-red-500/50 mb-6">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Instructions */}
        {!transcript && !error && (
          <p className="text-white/70 text-center text-lg">
            {isConnected 
              ? 'Start speaking to begin the conversation...'
              : 'Setting up connection...'}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 pb-[34px] pt-6">
        <div className="flex gap-4 justify-center">
          {isRecording ? (
            <button
              onClick={stopConversation}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Stop Conversation
            </button>
          ) : (
            <button
              onClick={startAudioCapture}
              disabled={!isConnected}
              className="px-6 py-3 bg-[#0A8F86] text-white rounded-xl hover:bg-[#0a7a72] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Speaking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

