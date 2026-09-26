import React, { useState, useEffect } from 'react';
import { Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, Phone, MapPin, MessageCircle, RefreshCw, ArrowLeft, ShieldCheck, Box, ChevronRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, OrderStatus } from '../types';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { navigateTo } from '../utils/router';

interface TrackingPageProps {
  initialOrderId?: string;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ initialOrderId }) => {
  const { trackOrder, settings } = useStore();
  const { lang, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Auto search if initialOrderId provided
  useEffect(() => {
    if (initialOrderId) {
      handlePerformSearch(initialOrderId);
    }
  }, [initialOrderId]);

  const handlePerformSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearchError('');
    const res = await trackOrder(query.trim());
    setIsSearching(false);

    if (res.success && res.order) {
      setTrackedOrder(res.order);
      setSearchError('');
    } else {
      setTrackedOrder(null);
      setSearchError(res.error || (lang === 'bn' ? 'এই অর্ডার আইডি বা ফোন নম্বরে কোনো অর্ডার খুঁজে পাওয়া যায়নি।' : 'No order found with this Order ID or Phone number.'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePerformSearch(searchQuery);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-[#fef6e6] text-[#654e22] border border-[#D4AF37] px-3 py-1 rounded-full text-xs font-black">অর্ডার গৃহীত / Pending</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full text-xs font-black">কনফার্মড / Confirmed</span>;
      case 'packaging':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 px-3 py-1 rounded-full text-xs font-black">প্যাকেজিং চলছে / Packaging</span>;
      case 'out_for_delivery':
        return <span className="bg-orange-100 text-orange-900 border border-orange-300 px-3 py-1 rounded-full text-xs font-black animate-pulse">ডেলিভারির জন্য বের হয়েছে / In Transit</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black">সফলভাবে ডেলিভার্ড / Delivered</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-900 border border-red-300 px-3 py-1 rounded-full text-xs font-black">বাতিল / Cancelled</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <button 
          onClick={() => navigateTo('/')}
          className="hover:text-stone-900 transition-colors flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
        </button>
        <ChevronRight className="w-3 h-3 text-stone-300" />
        <span className="text-stone-800 font-bold">
          {lang === 'bn' ? 'অর্ডার ট্র্যাকিং পেজ' : 'Order Tracking'}
        </span>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#0F392B] via-[#165640] to-[#0A2E22] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-600/30">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Truck className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D4AF37] text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>লাইভ পার্সেল ট্র্যাকিং</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
            {lang === 'bn' ? 'আপনার আচারের অর্ডার ট্র্যাক করুন' : 'Track Your Pickle Order'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            {lang === 'bn' 
              ? 'আপনার অর্ডার আইডি (যেমন: NBP-78921) অথবা যে ফোন নম্বর দিয়ে অর্ডার করেছেন তা লিখে সার্চ করুন।'
              : 'Enter your Order ID (e.g. NBP-78921) or registered phone number to view live order progress.'}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setSearchError('');
                  }}
                  placeholder="e.g. NBP-78921 or 017XXXXXXXX"
                  className="w-full pl-11 pr-4 py-3.5 bg-white text-stone-900 placeholder:text-stone-400 rounded-2xl text-sm font-semibold shadow-inner focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-7 py-3.5 rounded-2xl bg-[#D4AF37] hover:bg-[#D4AF37] active:scale-98 text-stone-950 font-black text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{lang === 'bn' ? 'ট্র্যাক করুন' : 'Track Order'}</span>
              </button>
            </div>

            {searchError && (
              <div className="mt-3 bg-red-500/20 border border-red-400/40 text-red-100 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* When Order is Tracked */}
      {trackedOrder ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Main Status Header Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Order ID:</span>
                  <span className="font-mono font-black text-lg sm:text-xl text-stone-900">#{trackedOrder.id}</span>
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Placed on: <span className="font-semibold text-stone-700">{new Date(trackedOrder.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                {getStatusBadge(trackedOrder.status)}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'bn' ? 'ডেলিভারি টাইমলাইন ও আপডেট' : 'Delivery Timeline & Progress'}</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {(trackedOrder.trackingHistory && trackedOrder.trackingHistory.length > 0 
                  ? trackedOrder.trackingHistory 
                  : [
                      { status: 'pending', title: 'Order Placed', description: 'Order received in system', timestamp: new Date(trackedOrder.createdAt).toLocaleDateString(), completed: true },
                      { status: 'confirmed', title: 'Confirmed & Stock Reserved', description: 'Address and jar quantity verified', timestamp: '', completed: trackedOrder.status !== 'pending' },
                      { status: 'packaging', title: 'Packaged with Care', description: 'Glass jars packed in protective bubble wrap', timestamp: '', completed: ['packaging', 'out_for_delivery', 'delivered'].includes(trackedOrder.status) },
                      { status: 'out_for_delivery', title: 'Out for Delivery', description: 'Courier rider on the way', timestamp: '', completed: trackedOrder.status === 'delivered', current: trackedOrder.status === 'out_for_delivery' },
                      { status: 'delivered', title: 'Delivered', description: 'Handed to recipient', timestamp: '', completed: trackedOrder.status === 'delivered' }
                    ]
                ).map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div 
                      className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        step.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : (step as any).current
                          ? 'bg-[#fefbf3]0 border-[#D4AF37] text-white animate-pulse shadow-sm'
                          : 'bg-white border-stone-300 text-stone-400'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (step as any).current ? (
                        <Truck className="w-3 h-3" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-stone-300" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm font-bold ${step.completed || (step as any).current ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.title}
                        </h4>
                        {step.timestamp && (
                          <span className="text-[11px] font-medium text-stone-400">{step.timestamp}</span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier & Delivery Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div className="space-y-0.5">
                <span className="text-stone-400 font-bold block">Courier Partner</span>
                <span className="font-extrabold text-stone-800">{trackedOrder.courierName || 'In-House Delivery Team'}</span>
                {trackedOrder.courierTrackingId && (
                  <div className="text-[11px] font-mono text-emerald-800 font-bold">
                    Consignment: {trackedOrder.courierTrackingId}
                  </div>
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-stone-400 font-bold block">Estimated Arrival</span>
                <span className="font-extrabold text-[#967623]">{trackedOrder.estimatedDeliveryDate || '24-48 Hours'}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-stone-400 font-bold block">Delivery Location</span>
                <span className="font-bold text-stone-800 truncate block">{trackedOrder.address}, {trackedOrder.city}</span>
              </div>
            </div>

          </div>

          {/* Ordered Items Summary */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'অর্ডারকৃত আচারের তালিকা' : 'Ordered Pickle Jars'} ({trackedOrder.items.length})</span>
            </h3>

            <div className="divide-y divide-stone-100">
              {trackedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 shadow-2xs"
                    />
                    <div>
                      <h4 className="font-black text-sm text-stone-900 font-serif">
                        {lang === 'bn' ? item.banglaName || item.productName : item.productName}
                      </h4>
                      <div className="text-xs text-stone-500 font-semibold mt-0.5">
                        সাইজ: <span className="text-stone-800 font-bold">{item.size}</span> • পরিমাণ: <span className="text-stone-800 font-bold">{item.quantity}টি জার</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-black text-sm text-stone-900">
                    ৳{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-bold text-stone-900">৳{trackedOrder.subtotal}</span>
              </div>
              {trackedOrder.discountAmount ? (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({trackedOrder.couponCode}):</span>
                  <span>-৳{trackedOrder.discountAmount}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge:</span>
                <span className="font-bold text-stone-900">৳{trackedOrder.deliveryFee}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-black text-stone-900">
                <span>Total Amount:</span>
                <span className="text-[#0F5338]">৳{trackedOrder.totalAmount}</span>
              </div>
              <div className="text-[11px] text-stone-500 pt-1">
                Payment Method: <span className="font-bold uppercase text-stone-800">{trackedOrder.paymentMethod}</span> ({trackedOrder.paymentStatus})
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={getWhatsAppUrl(
                  settings,
                  `আসসালামু আলাইকুম, আমি আমার অর্ডার #${trackedOrder.id} নিয়ে জানতে চাচ্ছি। কাস্টমার: ${trackedOrder.customerName}, ফোন: ${trackedOrder.phone}।`
                )}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'bn' ? 'অর্ডার নিয়ে হোয়াটসঅ্যাপে কথা বলুন' : 'Ask on WhatsApp'}</span>
              </a>

              <button
                onClick={() => navigateTo('/products')}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {lang === 'bn' ? 'আরও আচার কিনুন' : 'Shop More Pickles'}
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Empty State / How tracking works */
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mx-auto">
            <Box className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-black text-stone-900 font-serif">
              {lang === 'bn' ? 'অর্ডার আইডি দিয়ে লাইভ স্ট্যাটাস দেখুন' : 'Enter your Order ID to check live status'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {lang === 'bn'
                ? 'অর্ডার করার সময় আপনি যে ৫ ডিজিটের অর্ডার নম্বর (যেমন: NBP-78921) বা কনফার্মেশন মেসেজ পেয়েছেন, তা ওপরের বক্সে লিখে ট্র্যাক বাটনে চাপুন।'
                : 'Enter your 5-digit Order ID (e.g. NBP-78921) or mobile phone number in the search box above to track your fresh pickle shipment in real-time.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</div>
              <h4 className="font-bold text-xs text-stone-800">প্যাকেজিং আপডেট</h4>
              <p className="text-[11px] text-stone-500">বোটল সিলিং ও কোয়ালিটি চেকিং লাইভ দেখা যায়।</p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#fef6e6] text-[#7a5e23] flex items-center justify-center font-bold text-xs">2</div>
              <h4 className="font-bold text-xs text-stone-800">কুরিয়ার তথ্য</h4>
              <p className="text-[11px] text-stone-500">রাইডারের নাম ও ট্র্যাকিং নম্বর সাথে সাথেই পান।</p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">3</div>
              <h4 className="font-bold text-xs text-stone-800">২৪/৭ সাপোর্ট</h4>
              <p className="text-[11px] text-stone-500">কোনো প্রয়োজনে সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন।</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
