import { CheckCircle } from 'lucide-react';

interface ToastNotificationProps {
  message: string;
}

export function ToastNotification({ message }: ToastNotificationProps) {
  return (
    <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-[#0B1A1A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-[calc(100vw-32px)]">
        <CheckCircle className="w-5 h-5 text-[#0A8F86] flex-shrink-0" />
        <p>{message}</p>
      </div>
    </div>
  );
}
