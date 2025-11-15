import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface ElevenLabsWidgetProps {
  agentId: string;
  onClose: () => void;
  onComplete?: (data: any) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id'?: string;
        'signed-url'?: string;
      };
    }
  }
}

export function ElevenLabsWidget({ agentId, onClose, onComplete }: ElevenLabsWidgetProps) {
  const widgetRef = useRef<HTMLElement | null>(null);
  const scriptLoadedRef = useRef(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Try to fetch signed URL from backend (optional - widget can work without it)
  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://junction2025-backend-1087825056058.europe-north1.run.app';
        const response = await fetch(`${API_BASE_URL}/api/conversations/signed-url?agentId=${encodeURIComponent(agentId)}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.signed_url) {
            setSignedUrl(data.signed_url);
            return;
          }
        }
        // If signed URL fails, widget can still work with just agent-id
        console.log('Signed URL not available, using agent-id only');
      } catch (err) {
        // Widget can work without signed URL
        console.log('Signed URL fetch failed, widget will use agent-id only:', err);
      }
    };

    fetchSignedUrl();
  }, [agentId]);

  useEffect(() => {
    // Load the widget script
    const loadScript = () => {
      if (scriptLoadedRef.current) return;
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      script.onload = () => {
        scriptLoadedRef.current = true;
        console.log('ElevenLabs widget script loaded');
      };
      script.onerror = () => {
        console.error('Failed to load ElevenLabs widget script');
        setError('Failed to load widget script');
      };
      document.body.appendChild(script);
    };

    loadScript();

    // Cleanup
    return () => {
      // Script will remain in DOM, but that's okay for performance
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0B1A1A] z-50 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-[59px] pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white">Voice Conversation</h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Widget Container */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        {error ? (
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-white/70 text-sm">Falling back to custom implementation...</p>
          </div>
        ) : (
          <elevenlabs-convai 
            agent-id={agentId}
            {...(signedUrl && { 'signed-url': signedUrl })}
            ref={(el: any) => {
              if (el && !widgetRef.current) {
                widgetRef.current = el;
                // Listen for widget events
                el.addEventListener('conversation-end', (event: any) => {
                  console.log('Conversation ended:', event.detail);
                  if (onComplete) {
                    onComplete(event.detail);
                  }
                });
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

