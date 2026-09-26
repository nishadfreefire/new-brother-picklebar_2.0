import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, Phone, MapPin, MessageCircle, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, OrderStatus } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const OrderTrackingModal: React.FC = () => {
  const {
    isTrackingOpen,
    setIsTrackingOpen,
    activeTrackingOrder,
    setActiveTrackingOrder,
    trackOrder,
    settings
  } = useStore();

  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  if (!isTrackingOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError('');
    const res = await trackOrder(searchQuery.trim());
    setIsSearching(false);

    if (!res.success) {
      setSearchError(res.error || 'No order found with this ID or phone number.');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-[#fef6e6] text-[#7a5e23] px-3 py-1 rounded-full text-xs font-bold">অর্ডার প্রক্রিয়াধীন / Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">কনফার্মড / Confirmed</span>;
      case 'packaging':
        return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">প্যাকেজিং চলছে / Packaging</span>;
      case 'out_for_delivery':
        return <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">ডেলিভারির জন্য বের হয়েছে / In Transit</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">সফলভাবে ডেলিভার্ড / Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">বাতিল / Cancelled</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E6DEC8] overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] border-b border-[#E6DEC8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#5C3826] text-[#fceabd]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#2C241E] font-serif">
                {t('track.title')}
              </h2>
              <p className="text-xs text-[#5C3826] font-semibold">
                {t('track.subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Tracking Search Input */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setSearchError('');
                  }}
                  placeholder="e.g. NBP-78921 or 01711998877"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5C3826]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-5 py-3 rounded-2xl bg-[#5C3826] hover:bg-[#432818] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                <span>{t('track.button')}</span>
              </button>
            </div>
            {searchError && (
              <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{searchError}</span>
              </p>
            )}
          </form>

          {/* Active Order Details View */}
          {activeTrackingOrder ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Top Status Card */}
              <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-xs text-stone-500 font-semibold">Order ID:</span>
                    <h3 className="text-lg font-black text-stone-900">{activeTrackingOrder.id}</h3>
                  </div>
                  <div>
                    {getStatusBadge(activeTrackingOrder.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-stone-500 block">Customer:</span>
                    <strong className="text-stone-900">{activeTrackingOrder.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Courier Partner:</span>
                    <strong className="text-stone-900">{activeTrackingOrder.courierName || 'Assigned soon'}</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-stone-500 block">Estimated Arrival:</span>
                    <strong className="text-[#5C3826]">{activeTrackingOrder.estimatedDeliveryDate || '24-48 Hours'}</strong>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {t('track.timeline')}
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {activeTrackingOrder.trackingHistory.map((step, idx) => {
                    const isPassed = step.completed;
                    const isCurrent = step.current;

                    return (
                      <div key={idx} className="relative group">
                        {/* Status Icon */}
                        <div
                          className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isPassed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-[#5C3826] border-[#5C3826] text-white animate-pulse'
                              : 'bg-white border-gray-300 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </div>

                        {/* Step Details */}
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h5 className={`text-xs sm:text-sm font-bold ${isPassed || isCurrent ? 'text-[#16382C]' : 'text-gray-400'}`}>
                              {step.title}
                            </h5>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className={`text-xs ${isPassed || isCurrent ? 'text-[#786655]' : 'text-gray-400'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List in this Order */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC8] space-y-2">
                <div className="text-xs font-bold text-[#16382C] mb-1">
                  Ordered Items ({activeTrackingOrder.items.length}):
                </div>
                <div className="divide-y divide-[#E6DEC8]">
                  {activeTrackingOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={item.imageUrl} alt={item.productName} referrerPolicy="no-referrer" className="w-10 h-10 rounded-lg object-cover border" />
                        <div>
                          <span className="font-bold text-[#16382C] block">
                            {lang === 'bn' ? item.banglaName : item.productName}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Size: {item.size} • Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#E07A24]">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E6DEC8] flex justify-between text-xs font-extrabold text-[#16382C]">
                  <span>Total Amount Paid / Payable:</span>
                  <span className="text-sm text-[#E07A24]">৳{activeTrackingOrder.totalAmount}</span>
                </div>
              </div>

              {/* Support Contact */}
              <div className="flex justify-between items-center text-xs text-gray-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span>Need help with delivery?</span>
                <a
                  href={getWhatsAppUrl(
                    settings,
                    `Hi, inquiry regarding my order ${activeTrackingOrder.id}`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Support</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="py-8 text-center text-[#786655] space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E6DEC8] flex items-center justify-center mx-auto text-xl">
                📦
              </div>
              <p className="text-xs">
                Enter your Order ID (like <strong>NBP-78921</strong>) or phone number above to see real-time shipment status and courier timeline.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
