import { Battery, Wifi, Signal } from 'lucide-react';

export function StatusBar() {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="fixed top-0 left-0 right-0 max-w-[430px] mx-auto h-[59px] bg-[#0B1A1A] text-white z-50">
      <div className="flex items-center justify-between px-6 pt-3">
        {/* Time */}
        <span className="text-[15px] font-semibold">{currentTime}</span>
        
        {/* Status Icons */}
        <div className="flex items-center gap-2">
          <Signal className="w-[17px] h-[17px]" strokeWidth={2.5} />
          <Wifi className="w-[17px] h-[17px]" strokeWidth={2.5} />
          <div className="flex items-center gap-1">
            <Battery className="w-[24px] h-[24px]" strokeWidth={2.5} />
            <span className="text-[13px]">87%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
