import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '923216623367';
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I'd like to enquire about your services at Dual Craft."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function WhatsAppFAB() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 sm:left-auto sm:right-6 z-50 flex items-center gap-3 sm:flex-row-reverse">
      {/* FAB Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        id="whatsapp-fab"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`w-14 h-14 rounded-full bg-teal flex items-center justify-center 
          shadow-teal text-white transition-all duration-300
          hover:scale-110 hover:shadow-[0_6px_28px_rgba(0,194,184,0.5)]
          active:scale-95 flex-shrink-0`}
      >
        <MessageCircle size={26} fill="white" strokeWidth={0} />
      </a>

      {/* Tooltip */}
      <div
        className={`transition-all duration-300 pointer-events-none ${
          hovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-3 sm:translate-x-3'
        }`}
      >
        <div className="relative bg-navy text-white text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
          Chat with us on WhatsApp
          {/* Arrow for mobile (points left towards FAB) */}
          <div className="sm:hidden absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-[6px] border-transparent border-r-navy" />
          {/* Arrow for desktop (points right towards FAB) */}
          <div className="hidden sm:block absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-navy" />
        </div>
      </div>
    </div>
  );
}
