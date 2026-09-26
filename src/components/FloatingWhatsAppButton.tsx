import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useRoute } from '../utils/router';
import { X, Send, CheckCheck, MessageSquare, ChevronDown } from 'lucide-react';
import { getCleanWhatsAppPhone } from '../utils/whatsapp';

export const FloatingWhatsAppButton: React.FC = () => {
  const { settings } = useStore();
  const { lang } = useLanguage();
  const route = useRoute();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('10:00 AM');

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCurrentTime(formatted);
  }, []);

  // Do not show on admin dashboard
  if (route.page === 'admin') {
    return null;
  }

  // Check if admin enabled WhatsApp floating button (defaults to true)
  if (settings?.showWhatsappButton === false) {
    return null;
  }

  const cleanPhone = getCleanWhatsAppPhone(settings);

  const defaultMsg = settings?.whatsappMessage || (lang === 'bn' 
    ? 'আসসালামু আলাইকুম, আমি নিউ ব্রাদার আচার সম্পর্কে বিস্তারিত জানতে ও অর্ডার করতে চাই।'
    : 'Hello New Brother Picklebar, I would like to inquire about your pickles and place an order!');

  const quickReplies = lang === 'bn' ? [
    '🌶️ স্পেশাল আচার প্যাকেজ সম্পর্কে জানতে চাই',
    '📦 অর্ডার কনফার্ম করতে সহায়তা প্রয়োজন',
    '🚚 ডেলিভারি চার্জ এবং সময় কত?',
    '🔥 কোন আচারটি সবচেয়ে বেশি জনপ্রিয়?'
  ] : [
    '🌶️ Inquire about special pickle combos',
    '📦 Need help confirming my order',
    '🚚 What are the delivery charges & time?',
    '🔥 Which pickle is your best-seller?'
  ];

  const handleSendMessage = (messageToSend?: string) => {
    const text = (messageToSend || customMessage.trim() || defaultMsg);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end">
      {/* 1. Interactive WhatsApp Chat Popup Card */}
      {isOpen && (
        <div 
          id="whatsapp-chat-popup"
          className="w-[calc(100vw-32px)] sm:w-[360px] bg-[#ECE5DD] dark:bg-stone-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden mb-3.5 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* WhatsApp Brand Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.782-.88-2.057-.98-.276-.1-.476-.15-.677.15-.201.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.489-.893-.796-1.496-1.78-1.671-2.08-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.176.201-.301.302-.502.1-.2.05-.376-.025-.526-.075-.151-.677-1.633-.928-2.235-.245-.588-.493-.508-.677-.518-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.079 2.913 1.23 3.114.15.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.378.198 1.897.12.578-.087 1.782-.728 2.033-1.431.25-.704.25-1.307.175-1.431-.075-.125-.276-.2-.577-.35zM12.042 21.84c-1.815 0-3.535-.49-5.029-1.341l-.36-.205-3.743.982.999-3.649-.226-.36A9.79 9.79 0 0 1 2.25 12.04c0-5.394 4.39-9.784 9.792-9.784 2.614 0 5.07 1.018 6.918 2.868a9.73 9.73 0 0 1 2.87 6.924c0 5.396-4.39 9.792-9.788 9.792zm0-17.784c-4.406 0-7.992 3.585-7.992 7.984 0 1.408.369 2.781 1.07 3.992l.166.287-.665 2.433 2.493-.654.278.165a7.95 7.95 0 0 0 4.65 1.458c4.407 0 7.993-3.586 7.993-7.984 0-2.133-.831-4.139-2.34-5.65-1.51-1.51-3.516-2.341-5.645-2.341z" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight text-white leading-tight">
                  {settings?.storeName || 'New Brother Picklebar'}
                </h4>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {lang === 'bn' ? 'সরাসরি অনলাইন সাপোর্ট' : 'Online • Replies promptly'}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="close-whatsapp-modal-btn"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* WhatsApp Chat Body */}
          <div className="p-4 space-y-3 max-h-[340px] overflow-y-auto">
            {/* Incoming Message Bubble */}
            <div className="flex flex-col items-start max-w-[90%]">
              <div className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 p-3 rounded-2xl rounded-tl-xs shadow-sm border border-stone-200/50 text-xs leading-relaxed">
                <p className="font-semibold text-[#075E54] dark:text-emerald-400 mb-1">
                  {settings?.storeName || 'New Brother Picklebar'}
                </p>
                <p>
                  {lang === 'bn'
                    ? 'আসসালামু আলাইকুম! আচার অর্ডার, ডেলিভারি বা যেকোনো তথ্যের জন্য নিচে লিখুন অথবা কুইক বাটনে চাপুন।'
                    : 'Assalamu Alaikum! Inquire about our handmade pickles, orders, or delivery anytime.'}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-stone-400">
                  <span>{currentTime}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Quick Question Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block px-1">
                {lang === 'bn' ? 'কুইক মেসেজ সিলেক্ট করুন:' : 'Quick Questions:'}
              </span>
              <div className="flex flex-col gap-1.5">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomMessage(reply);
                      handleSendMessage(reply);
                    }}
                    className="text-left text-xs bg-white/90 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-stone-700/80 text-stone-700 dark:text-stone-200 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs hover:border-emerald-400 transition-all active:scale-[0.99] flex items-center justify-between group"
                  >
                    <span>{reply}</span>
                    <Send className="w-3 h-3 text-stone-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-1.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white dark:bg-stone-800/95 border-t border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="whatsapp-custom-input"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder={lang === 'bn' ? 'মেসেজ লিখুন...' : 'Type a message...'}
                className="flex-1 bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-100 text-xs px-3.5 py-2.5 rounded-full border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                id="whatsapp-send-redirect-btn"
                onClick={() => handleSendMessage()}
                aria-label="Send WhatsApp message"
                className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-stone-400 dark:text-stone-400">
                {lang === 'bn' 
                  ? 'মেসেজ বাটনে চাপ দিলে সরাসরি WhatsApp অ্যাপে চলে যাবে' 
                  : 'Clicking send will redirect directly to WhatsApp'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Action Bar & WhatsApp Launcher Button */}
      <div className="flex items-center gap-2.5">
        {/* Dismissible Floating Tooltip / Badge */}
        {showBadge && !isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md py-2 px-3.5 rounded-2xl shadow-xl shadow-stone-900/10 border border-stone-200/80 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs font-semibold animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            <span className="cursor-pointer select-none" onClick={() => setIsOpen(true)}>
              {lang === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat with us on WhatsApp'}
            </span>
            <button
              type="button"
              id="hide-whatsapp-badge-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowBadge(false);
              }}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ml-1"
              title={lang === 'bn' ? 'ব্যাজ হাইড করুন' : 'Hide badge'}
              aria-label="Hide badge"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Authentic Original WhatsApp Floating Button */}
        <button
          type="button"
          id="floating-whatsapp-btn"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowBadge(false);
          }}
          aria-label="Open WhatsApp Chat"
          title={isOpen ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
          className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl shadow-emerald-950/25 border-2 border-white/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {/* Subtle Ambient Pulse Animation (When closed) */}
          {!isOpen && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping -z-10 pointer-events-none"></span>
              <span className="absolute -inset-1 rounded-full bg-[#25D366]/20 animate-pulse -z-10 pointer-events-none"></span>
            </>
          )}

          {/* If open, show chevron/close icon, else show WhatsApp official vector logo */}
          {isOpen ? (
            <ChevronDown className="w-7 h-7 stroke-[2.5] text-white animate-in zoom-in-75 duration-150" />
          ) : (
            /* Authentic WhatsApp Official Vector Emblem */
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 fill-white drop-shadow-xs transition-transform group-hover:scale-105 duration-200"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.301-.15-1.782-.88-2.057-.98-.276-.1-.476-.15-.677.15-.201.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.489-.893-.796-1.496-1.78-1.671-2.08-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.176.201-.301.302-.502.1-.2.05-.376-.025-.526-.075-.151-.677-1.633-.928-2.235-.245-.588-.493-.508-.677-.518-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.079 2.913 1.23 3.114.15.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.378.198 1.897.12.578-.087 1.782-.728 2.033-1.431.25-.704.25-1.307.175-1.431-.075-.125-.276-.2-.577-.35zM12.042 21.84c-1.815 0-3.535-.49-5.029-1.341l-.36-.205-3.743.982.999-3.649-.226-.36A9.79 9.79 0 0 1 2.25 12.04c0-5.394 4.39-9.784 9.792-9.784 2.614 0 5.07 1.018 6.918 2.868a9.73 9.73 0 0 1 2.87 6.924c0 5.396-4.39 9.792-9.788 9.792zm0-17.784c-4.406 0-7.992 3.585-7.992 7.984 0 1.408.369 2.781 1.07 3.992l.166.287-.665 2.433 2.493-.654.278.165a7.95 7.95 0 0 0 4.65 1.458c4.407 0 7.993-3.586 7.993-7.984 0-2.133-.831-4.139-2.34-5.65-1.51-1.51-3.516-2.341-5.645-2.341z" />
            </svg>
          )}

          {/* Unread Alert Notification Badge on top right with dismiss toggle */}
          {showBadge && !isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
